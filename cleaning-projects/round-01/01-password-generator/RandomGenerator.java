public class RandomGenerator {
    int[] numbers = new int[10];
    static char[] characters =  { 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z' };

    private static int getRandomNumber(int number) {
        
        Random randomNumber = new Random();
        int pickedNumber = randomNumber.nextInt(number);
        
        return pickedNumber;
    }
}
