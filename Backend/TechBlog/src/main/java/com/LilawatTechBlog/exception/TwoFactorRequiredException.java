package com.LilawatTechBlog.exception;

public class TwoFactorRequiredException extends RuntimeException{
    private final String email;

    public TwoFactorRequiredException(String email) {
        super("2FA Required");
        this.email = email;
    }

    public String getEmail() {
        return email;
    }
}
