import java.util.Scanner;

public class Input {
    private final Scanner input = new Scanner(System.in);

    public Input() {
        System.out.print("Settings for your new Password:\n");
        System.out.print("length(8 - 31):");
        String passwordLength = input.nextLine();

        System.out.print("Please answer with y or n.");
        System.out.print("Uppercase (y/n):");
        String passwordUppercase = input.nextLine();

        System.out.print("Digits (y/n):");
        String passwordDigits = input.nextLine();

        System.out.print("special Digits (y/n):");
        String passwordSpecialDigits = input.nextLine();
    }
}
