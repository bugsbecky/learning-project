import java.util.Scanner;

public class Input {
    private final Scanner input = new Scanner(System.in);

    public Input() {
        System.out.print("Settings for your new Password:\n");
    }

    public int getRequestedPasswordLength() {
        System.out.print("length(8 - 31):");
        int passwordLength = input.nextInt();
        return passwordLength;
    }

    public String getPasswordUppercase() {
        System.out.print("Please answer with y or n.");
        System.out.print("Uppercase (y/n):");
        String passwordUppercase = input.nextLine();
        return passwordUppercase;
    }

    public String getPasswordSpecialDigits() {
        System.out.print("special Digits (y/n):");
        String passwordSpecialDigits = input.nextLine();
        return passwordSpecialDigits;
    }

    public String getPasswordDigits() {
        System.out.print("Digits (y/n):");
        String passwordDigits = input.nextLine();
        return passwordDigits;
    }
}
