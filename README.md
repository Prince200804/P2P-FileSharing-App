# PeerLink - Secure P2P File Sharing

A secure peer-to-peer file sharing application with PIN-based authentication. Share files easily with a 6-digit invite code.

## 🌟 Features

- **Secure File Sharing**: Files are protected with 6-digit PIN authentication
- **One-Time Use**: Each invite code can only be used once
- **Auto-Delete**: Files are automatically deleted after download
- **Rate Limiting**: 10 uploads per IP address per minute
- **File Validation**: Validates file extensions, MIME types, and size limits
- **Modern UI**: Built with Next.js 14 and Tailwind CSS
- **P2P Architecture**: Direct file transfer using TCP sockets

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17 or higher** - [Download](https://adoptium.net/)
- **Maven 3.9 or higher** - [Download](https://maven.apache.org/download.cgi)
- **Node.js 18 or higher** - [Download](https://nodejs.org/)
- **npm** (comes with Node.js)

### Verify Installation

```bash
# Check Java version
java -version

# Check Maven version
mvn -version

# Check Node.js version
node -v

# Check npm version
npm -v
```

## 🚀 Installation

### 1. Clone/Navigate to the Project

```bash
cd C:\Peerlink
```

### 2. Backend Setup (Java)

```bash
# Navigate to the backend directory (project root)
cd C:\Peerlink

# Clean and build the project
mvn clean package

# This will:
# - Compile all Java source files
# - Run tests
# - Create a JAR file in the target directory
```

### 3. Frontend Setup (Next.js)

```bash
# Navigate to the UI directory
cd ui

# Install dependencies
npm install

# This will install:
# - Next.js 14
# - React 18
# - TypeScript
# - Tailwind CSS
# - Axios
# - React Dropzone
# - React Icons
```

## ▶️ Running the Application

You need to run **both** the backend and frontend servers.

### Terminal 1: Start Backend Server

```bash
# From C:\Peerlink directory
mvn exec:java -Dexec.mainClass="org.abhineshjha.App"
```

**Expected Output:**
```
File server controller started on port 8080
```

The backend server will:
- Listen on port 8080
- Handle file uploads and downloads
- Manage P2P connections on dynamic ports (49152-65535)

### Terminal 2: Start Frontend Server

```bash
# From C:\Peerlink\ui directory
npm run dev
```

**Expected Output:**
```
- ready started server on 0.0.0.0:3000, url: http://localhost:3000
```

### Access the Application

Open your browser and navigate to:
```
http://localhost:3000
```

## 📝 Configuration Guide

### What You Need to Configure

#### 1. Backend Configuration (OPTIONAL)

**File:** `src/main/java/org/abhineshjha/controller/FileController.java`

```java
// Line 12: Change server port (default: 8080)
private static final int PORT = 8080; // Change to your preferred port
```

**File:** `src/main/java/org/abhineshjha/utils/UploadUtils.java`

```java
// Lines 7-8: Change dynamic port range for P2P transfers
int DYNAMIC_STARTING_PORT = 49152; // Change starting port
int DYNAMIC_ENDING_PORT = 65535;   // Change ending port
```

**File:** `src/main/java/org/abhineshjha/handler/UploadHandler.java`

```java
// Line 23: Change rate limit (default: 10 uploads per minute)
private static final int MAX_UPLOADS_PER_MINUTE = 10;

// Line 24: Change max file size (default: 500MB)
private static final long MAX_FILE_SIZE = 500 * 1024 * 1024; // 500MB in bytes

// Lines 26-37: Add or remove allowed file extensions
private static final Set<String> ALLOWED_EXTENSIONS = Set.of(
    "txt", "pdf", "jpg", "jpeg", "png", "gif",
    "zip", "doc", "docx", "csv"
    // Add more extensions here
);

// Lines 39-50: Add or remove allowed MIME types
private static final Set<String> ALLOWED_MIME_TYPES = Set.of(
    "text/plain",
    "application/pdf",
    "image/jpeg", "image/png", "image/gif",
    "application/zip", "application/x-zip-compressed",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "text/csv", "application/octet-stream"
    // Add more MIME types here
);
```

#### 2. Frontend Configuration

**File:** `ui/next.config.js`

```javascript
// Line 6: Change backend API URL if you changed the backend port
destination: 'http://localhost:8080/api/:path*',
// Change to: 'http://localhost:YOUR_PORT/api/:path*'
```

#### 3. Environment Variables (OPTIONAL)

Create a `.env.local` file in the `ui` directory for environment-specific settings:

```bash
# ui/.env.local
NEXT_PUBLIC_API_URL=http://localhost:8080
```

## 🔌 API Documentation

### 1. Upload File API

**Endpoint:** `POST /api/upload`

**Description:** Upload a file and receive a 6-digit invite code

**Request:**
- **Method:** POST
- **Content-Type:** multipart/form-data
- **Body:**
  - `file`: The file to upload (max 500MB)

**Example using cURL:**
```bash
curl -X POST http://localhost:8080/api/upload \
  -F "file=@/path/to/your/file.pdf"
```

**Success Response:**
```json
{
  "status": "success",
  "message": "File uploaded successfully",
  "token": "123456",
  "fileName": "file.pdf"
}
```

**Error Responses:**

Rate Limit Exceeded (429):
```json
{
  "status": "error",
  "message": "Rate limit exceeded. Maximum 10 uploads per minute."
}
```

Invalid File Type (400):
```json
{
  "status": "error",
  "message": "Invalid file type: .exe"
}
```

File Too Large (400):
```json
{
  "status": "error",
  "message": "File too large. Maximum size is 500MB"
}
```

### 2. Download File API

**Endpoint:** `GET /api/download?token={PIN}`

**Description:** Download a file using the 6-digit invite code

**Request:**
- **Method:** GET
- **Query Parameters:**
  - `token`: 6-digit invite code (e.g., 123456)

**Example using cURL:**
```bash
curl -X GET "http://localhost:8080/api/download?token=123456" \
  --output downloaded_file.pdf
```

**Success Response:**
- **Status:** 200 OK
- **Headers:**
  - `Content-Type`: File's MIME type
  - `Content-Disposition`: attachment; filename="original_filename.pdf"
- **Body:** File binary data

**Error Responses:**

Invalid Token (403):
```json
{
  "status": "error",
  "message": "Invalid access token"
}
```

File Not Found (404):
```json
{
  "status": "error",
  "message": "File not found"
}
```

### API Flow Diagram

```
User Upload:
1. User selects file in UI
2. Frontend sends POST /api/upload
3. Backend validates file (extension, MIME type, size)
4. Backend checks rate limit
5. Backend saves file with temporary name
6. Backend generates 6-digit PIN
7. Backend starts P2P server on dynamic port
8. Backend returns PIN to user

User Download:
1. User enters 6-digit PIN in UI
2. Frontend sends GET /api/download?token={PIN}
3. Backend validates PIN
4. Backend finds associated port
5. Backend connects to P2P server
6. Backend streams file to user
7. Backend deletes file and invalidates PIN
```

## 🗂️ Project Structure

```
C:\Peerlink\
├── src/
│   ├── main/
│   │   └── java/
│   │       └── org/
│   │           └── abhineshjha/
│   │               ├── App.java                    # Main application entry point
│   │               ├── controller/
│   │               │   └── FileController.java     # HTTP server setup
│   │               ├── handler/
│   │               │   ├── CORSHandler.java        # CORS handling
│   │               │   ├── DownloadHandler.java    # Download endpoint
│   │               │   └── UploadHandler.java      # Upload endpoint
│   │               ├── service/
│   │               │   └── FileSharer.java         # P2P file sharing logic
│   │               └── utils/
│   │                   ├── MultiParser.java        # Multipart form parser
│   │                   └── UploadUtils.java        # Port generation utility
│   └── test/
│       └── java/
│           └── org/
│               └── abhineshjha/
│                   └── AppTest.java                # Unit tests
├── ui/
│   ├── src/
│   │   ├── app/
│   │   │   ├── layout.tsx                          # Root layout
│   │   │   ├── page.tsx                            # Main page
│   │   │   └── globals.css                         # Global styles
│   │   └── components/
│   │       ├── FileUpload.tsx                      # Upload component
│   │       ├── FileDownload.tsx                    # Download component
│   │       └── InviteCode.tsx                      # Code display component
│   ├── package.json                                # NPM dependencies
│   ├── tsconfig.json                               # TypeScript config
│   ├── next.config.js                              # Next.js config
│   ├── tailwind.config.ts                          # Tailwind CSS config
│   └── postcss.config.js                           # PostCSS config
├── pom.xml                                         # Maven configuration
└── README.md                                       # This file
```

## 🔒 Security Features

1. **PIN Authentication**: 6-digit PIN for each file transfer
2. **Rate Limiting**: Maximum 10 uploads per IP per minute
3. **File Extension Validation**: Only allowed file types can be uploaded
4. **MIME Type Validation**: Validates actual file content
5. **File Size Limit**: Maximum 500MB per file
6. **One-Time Use**: Each PIN can only be used once
7. **Auto-Delete**: Files are deleted after download
8. **CORS Protection**: Configured CORS headers
9. **Timeout Protection**: Socket timeouts prevent hanging connections

## 🐛 Troubleshooting

### Backend Issues

**Problem:** Port 8080 already in use
```
Solution: Change the port in FileController.java (line 12) or kill the process using port 8080
```

**Problem:** Maven build fails
```
Solution: 
1. Ensure Java 17+ is installed: java -version
2. Clear Maven cache: mvn clean
3. Update dependencies: mvn clean install -U
```

**Problem:** Files not uploading
```
Solution:
1. Check file size (must be < 500MB)
2. Check file extension (must be in allowed list)
3. Check rate limit (max 10 uploads/minute per IP)
```

### Frontend Issues

**Problem:** npm install fails
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm cache clean --force
3. Run: npm install
```

**Problem:** "Cannot connect to backend"
```
Solution:
1. Ensure backend is running on port 8080
2. Check next.config.js rewrites configuration
3. Clear browser cache
```

**Problem:** Download not starting
```
Solution:
1. Verify the 6-digit PIN is correct
2. Ensure PIN hasn't been used already (one-time use)
3. Check browser console for errors
```

## 🧪 Testing

### Run Backend Tests

```bash
mvn test
```

### Test Upload API

```bash
# Using cURL
curl -X POST http://localhost:8080/api/upload \
  -F "file=@test.pdf" \
  -v
```

### Test Download API

```bash
# Replace 123456 with actual PIN
curl -X GET "http://localhost:8080/api/download?token=123456" \
  --output downloaded.pdf \
  -v
```

## 📦 Building for Production

### Backend

```bash
# Create executable JAR
mvn clean package

# Run the JAR
java -jar target/peerlink-1.0-SNAPSHOT.jar
```

### Frontend

```bash
cd ui

# Build for production
npm run build

# Start production server
npm start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is open source and available under the MIT License.

## 💡 Tips for Customization

### Adding New File Types

1. **Backend:** Update `ALLOWED_EXTENSIONS` and `ALLOWED_MIME_TYPES` in `UploadHandler.java`
2. **Frontend:** No changes needed (automatically supports all backend-allowed types)

### Changing Upload Limits

1. **Rate Limit:** Modify `MAX_UPLOADS_PER_MINUTE` in `UploadHandler.java`
2. **File Size:** Modify `MAX_FILE_SIZE` in `UploadHandler.java` and `maxSize` in `FileUpload.tsx`

### Custom Branding

1. **Title:** Update `metadata.title` in `ui/src/app/layout.tsx`
2. **Colors:** Modify Tailwind classes in component files
3. **Logo:** Add logo to `ui/public/` and import in components

## 📞 Support

For issues and questions:
- Check the Troubleshooting section above
- Review API documentation
- Check browser console for frontend errors
- Check terminal output for backend errors

## 🎉 Usage Example

### Sharing a File

1. **Upload File:**
   - Open http://localhost:3000
   - Click "Upload File" tab
   - Drag and drop a file or click to select
   - Click "Upload File" button
   - Copy the 6-digit PIN (e.g., 847291)

2. **Share PIN:**
   - Share the 6-digit PIN with the recipient via email, chat, etc.

3. **Download File:**
   - Recipient opens http://localhost:3000
   - Clicks "Download File" tab
   - Enters the 6-digit PIN
   - Clicks "Download File" button
   - File downloads automatically

4. **Auto-Cleanup:**
   - After download, the PIN becomes invalid
   - The file is automatically deleted from the server

---

**Happy File Sharing! 🚀**
