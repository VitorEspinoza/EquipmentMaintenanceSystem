package br.com.backend.backend.Utils;

public class PasswordGenerator {
    public static String generateRandomPassword() {
        StringBuilder randomPassword = new StringBuilder();
        for (int i =0 ; i < 4; i++) {
            Double randomNumber = Math.random() * 4;
            randomPassword.append(randomNumber);
        }
        return randomPassword.toString();
    }
}
