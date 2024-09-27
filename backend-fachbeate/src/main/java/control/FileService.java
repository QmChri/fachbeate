package control;

import entity.dto.FileDtos;
import entity.dto.FileUploadRequest;
import entity.dto.MultipleFileUploadRequest;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.PathParam;
import jakarta.ws.rs.core.MultivaluedMap;
import jakarta.ws.rs.core.Response;
import org.jboss.logging.Logger;
import org.jboss.resteasy.plugins.providers.multipart.InputPart;
import org.jboss.resteasy.plugins.providers.multipart.MultipartFormDataInput;

import java.io.File;
import java.io.FileOutputStream;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.util.ArrayList;
import java.util.Base64;
import java.util.List;

@ApplicationScoped
public class FileService {
    @Inject
    Logger LOGGER;

    public boolean saveFilesToDir(MultipleFileUploadRequest request, String savePath, String FileSaveDir) throws IOException {
        if (request.files != null && !request.files.isEmpty()) {
            try {
                String fullDirPath = FileSaveDir + savePath.replace("_", "/");;

                File directory = new File(fullDirPath);
                if (directory.exists()) {
                    deleteDirectoryRecursively(directory);
                }
                if(!directory.exists()) {
                    if(!directory.mkdirs()){
                        return false;
                    }
                }

                for (FileUploadRequest fileRequest : request.files) {
                    byte[] fileData = Base64.getDecoder().decode(fileRequest.fileContent);

                    File outputFile = new File(fullDirPath + "/" + fileRequest.fileName);
                    try (FileOutputStream fos = new FileOutputStream(outputFile)) {
                        fos.write(fileData);
                    }
                }


            } catch (IOException e) {
                e.printStackTrace();
            }
        }

        return true;
    }
    public void deleteDirectoryRecursively(File directory) throws IOException {
        if (directory.exists()) {
            // Check if it's a directory
            if (directory.isDirectory()) {
                // List all files and directories in the current directory
                File[] files = directory.listFiles();
                if (files != null) {
                    for (File file : files) {
                        // Recursively delete files and subdirectories
                        deleteDirectoryRecursively(file);
                    }
                }
            }
            // Delete the directory or file
            if (!directory.delete()) {
                LOGGER.info("Failed to delete: " + directory.getAbsolutePath());
            }
        }
    }

    private String getFileName(InputPart part) {
        // Extract file name from part headers
        MultivaluedMap<String, String> headers = part.getHeaders();
        String contentDisposition = headers.getFirst("Content-Disposition");
        String[] contentDispositionParts = contentDisposition.split(";");
        for (String partStr : contentDispositionParts) {
            if (partStr.trim().startsWith("filename")) {
                return partStr.substring(partStr.indexOf('=') + 1).trim().replace("\"", "");
            }
        }
        return "unknown";
    }


    public List<FileDtos> getFileList(String uploadPath){
        List<FileDtos> files = new ArrayList<>();

        File uploadDir = new File(uploadPath);

        if(uploadDir.exists() && uploadDir.isDirectory()) {
            try {
                Files.list(uploadDir.toPath())
                        .filter(Files::isRegularFile) // Only process regular files
                        .forEach(filePath -> {
                            try {
                                byte[] fileBytes = Files.readAllBytes(filePath);
                                String content = Base64.getEncoder().encodeToString(fileBytes);

                                String fileName = filePath.getFileName().toString();
                                files.add(new FileDtos(fileName, content));
                            } catch (IOException e) {
                                LOGGER.info(e);
                            }
                        });


            } catch (IOException e) {
                LOGGER.info(e);
            }
        }
        return files;
    }

}
