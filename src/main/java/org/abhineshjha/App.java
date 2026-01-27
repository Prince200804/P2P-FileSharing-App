package org.abhineshjha;

import java.io.IOException;

import org.abhineshjha.controller.FileController;

public class App 
{
    public static void main( String[] args )
    {
        try {
            // Start the API server on port 8080
            FileController fileController = new FileController(8080);
            fileController.start();

            System.out.println("PeerLink server started on port 8080");
            System.out.println("UI available at http://localhost:3000");

            Runtime.getRuntime().addShutdownHook(new Thread(() -> {
                System.out.println("Shutting down server...");
                fileController.stop();
            }));

            // Keep the application running indefinitely (for Docker/production)
            System.out.println("Server is running. Press Ctrl+C to stop.");
            Thread.currentThread().join();

        } catch (IOException e) {
            System.err.println("Error starting server: " + e.getMessage());
            System.exit(1);
        } catch (InterruptedException e) {
            System.err.println("Server interrupted: " + e.getMessage());
            Thread.currentThread().interrupt();
        }
    }
}
