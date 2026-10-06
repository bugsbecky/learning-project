import java.lang.reflect.Array;
import java.util.Random;
public class RandomGenerator {
    int[] numbers = new int[10];
    static char[] characters =  { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k' +
    'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };

    public int getRandomNumber(int length) {
        
        String[][] digitOptions = {
            {"a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k",
            "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v",
            "w", "x", "y", "z"},
            {"0", "1", "2", "3", "4", "5", "6", "7", "8", "9"},
            {"!", "\"", "§", "$", "%", "&", "/", "(", ")", "=", "?", "*", "+"}
        };

        Random randomNumber = new Random();
        
        for(int i = 0; i < length; i++) {
            //später nur die reihen, zu denen User y gesagt hat
            int pickedInteger = randomNumber.nextInt(3);
            if(pickedInteger == 0) {
                int pickedLetter = randomNumber.nextInt(26);
            }
            
        }
        
    }

}

// was fehlt: es soll random entschieden werden, ob ein Buchstabe, Sonderzeichen oder eine Zahl die nächste Ziffer ist
//so of wie der User im Input angegeben hat
