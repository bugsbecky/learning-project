public class Main {
    public static void main(String[] args) {
        Input input = new Input();
        int requestedPasswordLength = input.getRequestedPasswordLength();
        
        RandomGenerator randomGenerator = new RandomGenerator();
        String password = randomGenerator.getRandomNumber(requestedPasswordLength);
        
        new PrintRandomNumber();
    }
}
