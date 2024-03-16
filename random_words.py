import random

def main():
    file = open('data/5-letter words.txt')
    all_words = []
    for line in file:
        all_words.append(line.strip())
    index = random.randint(0, len(all_words))
    print(all_words[index])
main()