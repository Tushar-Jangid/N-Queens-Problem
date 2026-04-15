/**
 * N-Queens Solver — Core Algorithm
 * Backtracking with O(1) constraint checking.
 * Chessboard represented as a 2D array.
 */
class NQueensSolver {
    constructor(n) {
        this.n = n;
        this.reset();
    }

    reset() {
        const n = this.n;
        this.board = Array.from({ length: n }, () => Array(n).fill(0));
        this.cols = new Set();
        this.diag1 = new Set();
        this.diag2 = new Set();
        this.solutions = [];
        this.steps = 0;
        this.backtracks = 0;
        this.queensPlaced = 0;
        this.solved = false;
        this.finished = false;
    }

    isSafe(row, col) {
        return !this.cols.has(col) && !this.diag1.has(row - col) && !this.diag2.has(row + col);
    }

    placeQueen(row, col) {
        this.board[row][col] = 1;
        this.cols.add(col);
        this.diag1.add(row - col);
        this.diag2.add(row + col);
        this.queensPlaced++;
    }

    removeQueen(row, col) {
        this.board[row][col] = 0;
        this.cols.delete(col);
        this.diag1.delete(row - col);
        this.diag2.delete(row + col);
        this.queensPlaced--;
    }

    getAttackedCells() {
        const attacked = [];
        for (let r = 0; r < this.n; r++) {
            for (let c = 0; c < this.n; c++) {
                if (this.board[r][c] === 1) continue;
                if (this.cols.has(c) || this.diag1.has(r - c) || this.diag2.has(r + c)) {
                    attacked.push({ row: r, col: c });
                }
            }
        }
        return attacked;
    }

    getQueenPositions() {
        const queens = [];
        for (let r = 0; r < this.n; r++)
            for (let c = 0; c < this.n; c++)
                if (this.board[r][c] === 1) queens.push({ row: r, col: c });
        return queens;
    }

    solveImmediate() {
        this.reset();
        return this._backtrack(0);
    }

    _backtrack(row) {
        if (row === this.n) { this.solved = true; this.finished = true; return true; }
        for (let col = 0; col < this.n; col++) {
            this.steps++;
            if (this.isSafe(row, col)) {
                this.placeQueen(row, col);
                if (this._backtrack(row + 1)) return true;
                this.removeQueen(row, col);
                this.backtracks++;
            }
        }
        return false;
    }

    findAllSolutions() {
        this.reset();
        this._findAll(0);
        this.finished = true;
        return this.solutions;
    }

    _findAll(row) {
        if (row === this.n) { this.solutions.push(this.board.map(r => [...r])); return; }
        for (let col = 0; col < this.n; col++) {
            this.steps++;
            if (this.isSafe(row, col)) {
                this.placeQueen(row, col);
                this._findAll(row + 1);
                this.removeQueen(row, col);
                this.backtracks++;
            }
        }
    }

    generateStepTrace() {
        this.reset();
        const trace = [];
        this._traceBacktrack(0, trace);
        return trace;
    }

    _traceBacktrack(row, trace) {
        if (row === this.n) {
            trace.push({ type: 'solved', queens: this.getQueenPositions(), board: this.board.map(r => [...r]) });
            return true;
        }
        for (let col = 0; col < this.n; col++) {
            this.steps++;
            trace.push({ type: 'try', row, col, safe: this.isSafe(row, col), steps: this.steps, backtracks: this.backtracks, queensPlaced: this.queensPlaced });
            if (this.isSafe(row, col)) {
                this.placeQueen(row, col);
                trace.push({ type: 'place', row, col, queens: this.getQueenPositions(), attacked: this.getAttackedCells(), steps: this.steps, backtracks: this.backtracks, queensPlaced: this.queensPlaced });
                if (this._traceBacktrack(row + 1, trace)) return true;
                this.removeQueen(row, col);
                this.backtracks++;
                trace.push({ type: 'remove', row, col, queens: this.getQueenPositions(), steps: this.steps, backtracks: this.backtracks, queensPlaced: this.queensPlaced });
            }
        }
        return false;
    }
}
