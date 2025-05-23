package br.com.backend.backend.Utils;

import java.util.Random;

public class PasswordGenerator {
    public static String generateRandomPassword() {
        Random random = new Random();
        int password = 1000 + random.nextInt(9000);
        return String.valueOf(password);
    }
}
