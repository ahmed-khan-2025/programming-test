def parse_input_file(filename):
    with open(filename, 'r') as f:
        lines = [line.strip() for line in f if line.strip()]

    draw_numbers = []
    boards = []
    current_board = []

    reading_draws = False
    reading_boards = False

    for line in lines:
        if line.lower().startswith("draw numbers"):
            reading_draws = True
            continue
        elif reading_draws and not draw_numbers:
            draw_numbers = [int(x) for x in line.split(',')]
            reading_draws = False
            continue
        elif line.lower().startswith("boards"):
            reading_boards = True
            continue

        if reading_boards:
            current_board.append([int(x) for x in line.split()])
            if len(current_board) == 5:
                boards.append(current_board)
                current_board = []

    # Catch any remaining board
    if current_board:
        boards.append(current_board)

    return draw_numbers, boards


def mark_number(board, number):
    for i in range(len(board)):
        for j in range(len(board[i])):
            if board[i][j] == number:
                board[i][j] = 'X'


def check_winner(board):
    # Check rows
    for row in board:
        if all(num == 'X' for num in row):
            return True

    # Check columns
    for col in zip(*board):
        if all(num == 'X' for num in col):
            return True

    return False


def calculate_score(board, last_number):
    unmarked_sum = sum(
        num for row in board for num in row if num != 'X'
    )
    return unmarked_sum * last_number


if __name__ == "__main__":
    input_file = "input.txt"  # Update if needed
    draw_numbers, boards = parse_input_file(input_file)

    last_score = None
    winning_boards = set()

    for number in draw_numbers:
        for idx, board in enumerate(boards):
            if idx in winning_boards:
                continue

            mark_number(board, number)
            if check_winner(board):
                winning_boards.add(idx)
                last_score = calculate_score(board, number)

    print("Final score:", last_score)
