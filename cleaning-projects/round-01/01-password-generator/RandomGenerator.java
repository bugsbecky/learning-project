import java.util.Random;
public class RandomGenerator {
    int[] numbers = new int[10];
    static char[] characters =  { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' +
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };

    public int getRandomNumber(int number) {
        
        String[] digitOptions = {};
        
        Random randomNumber = new Random();
        int pickedNumber = randomNumber.nextInt(number);
        
        return pickedNumber;
    }

}

// was fehlt: es soll random entschieden werden, ob ein Buchstabe, Sonderzeichen oder eine Zahl die nächste Ziffer ist
//so of wie der User im Input angegeben hat
