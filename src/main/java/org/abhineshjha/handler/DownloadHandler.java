package org.abhineshjha.handler;

import java.io.File;
import java.io.FileInputStream;
import java.io.IOException;
import java.io.OutputStream;

import org.abhineshjha.service.FileSharer;

import com.sun.net.httpserver.Headers;
import com.sun.net.httpserver.HttpExchange;
import com.sun.net.httpserver.HttpHandler;

public class DownloadHandler implements HttpHandler {
    private final FileSharer fileSharer;

    public DownloadHandler(FileSharer fileSharer) {
        this.fileSharer = fileSharer;
    }

    @Override
    public void handle(HttpExchange exchange) throws IOException {
        Headers headers = exchange.getResponseHeaders();
        headers.add("Access-Control-Allow-Origin", "*");
        headers.add("Access-Control-Allow-Methods", "GET,POST,OPTIONS");
        headers.add("Access-Control-Allow-Headers", "Content-Type,Authorization");

        if (exchange.getRequestMethod().equalsIgnoreCase("OPTIONS")) {
            exchange.sendResponseHeaders(204, -1);
            return;
        }

        if (!exchange.getRequestMethod().equalsIgnoreCase("GET")) {
            String response = "Method Not Allowed";
            exchange.sendResponseHeaders(405, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
            return;
        }

        // Get token from query parameter
        String query = exchange.getRequestURI().getQuery();
        String token = null;
        if (query != null) {
            String[] params = query.split("&");
            for (String param : params) {
                if (param.startsWith("token=")) {
                    token = param.substring(6);
                    break;
                }
            }
        }

        if (token == null || token.isEmpty()) {
            String response = "Access denied: Missing token";
            headers.add("Content-Type", "text/plain");
            exchange.sendResponseHeaders(403, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
            return;
        }

        try {
            // Get file path by token
            String filePath = fileSharer.getFilePathByToken(token);
            if (filePath == null) {
                String response = "Access denied: Invalid or expired token";
                headers.add("Content-Type", "text/plain");
                exchange.sendResponseHeaders(403, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }
            
            File file = new File(filePath);
            if (!file.exists()) {
                String response = "File not found";
                headers.add("Content-Type", "text/plain");
                exchange.sendResponseHeaders(404, response.getBytes().length);
                try (OutputStream os = exchange.getResponseBody()) {
                    os.write(response.getBytes());
                }
                return;
            }

            // Extract original filename from the unique filename (format: UUID_originalname)
            String fileName = file.getName();
            int underscoreIndex = fileName.indexOf('_');
            if (underscoreIndex != -1 && underscoreIndex < fileName.length() - 1) {
                fileName = fileName.substring(underscoreIndex + 1);
            }

            // Send the file directly via HTTP
            headers.add("Content-Disposition", "attachment; filename=\"" + fileName + "\"");
            headers.add("Content-Type", "application/octet-stream");
            exchange.sendResponseHeaders(200, file.length());
            
            try (OutputStream os = exchange.getResponseBody();
                 FileInputStream fis = new FileInputStream(file)) {
                byte[] buffer = new byte[8192];
                int bytesRead;
                while ((bytesRead = fis.read(buffer)) != -1) {
                    os.write(buffer, 0, bytesRead);
                }
            }
            
            // Clean up: delete file and invalidate token after successful download
            fileSharer.cleanupAfterDownload(token);
            if (file.exists()) {
                file.delete();
                System.out.println("File deleted after download: " + fileName);
            }
            
        } catch (IOException e) {
            System.err.println("Error downloading file: " + e.getMessage());
            String response = "Error downloading file: " + e.getMessage();
            headers.add("Content-Type", "text/plain");
            exchange.sendResponseHeaders(500, response.getBytes().length);
            try (OutputStream os = exchange.getResponseBody()) {
                os.write(response.getBytes());
            }
        }
    }
}
