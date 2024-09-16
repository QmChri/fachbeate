package control;

import entity.dto.FileDtos;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.ws.rs.core.MultivaluedMap;
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

    public boolean saveFilesToDir(MultipartFormDataInput input, Long id, String FileSaveDir) throws IOException {
        if (input.getFormDataMap().get("files") != null && !input.getFormDataMap().get("files").isEmpty()) {
            File directory = new File(FileSaveDir + id);
            if (directory.exists()) {
                deleteDirectoryRecursively(directory);
            }
            if(directory.mkdirs()) {
                for (InputPart part : input.getFormDataMap().get("files")) {
                    String fileName = getFileName(part); // Implement this method to get file name

                    if (fileName.equals("unknown")) {
                        continue;
                    }

                    InputStream inputStream = part.getBody(InputStream.class, null);
                    File file = new File(directory, fileName);

                    try (FileOutputStream outputStream = new FileOutputStream(file)) {
                        byte[] buffer = new byte[1024];
                        int bytesRead;
                        while ((bytesRead = inputStream.read(buffer)) != -1) {
                            outputStream.write(buffer, 0, bytesRead);
                        }
                    } catch (IOException e) {
                        e.printStackTrace();
                        return false;
                    }
                }
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
