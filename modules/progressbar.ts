import readline from 'readline';
export class progressBar {

    private size: number;
    private current: number;

    constructor(size: number){
        this.size = size;
        this.current = 0;
    }

    public start() {
        
        this.clearLines(8)
        readline.cursorTo(process.stdout, 0, 1)
        process.stdout.write("\x1B[?25l") // hide cursor
        process.stdout.write("[")
        for (let i = 0; i < this.size - 2; i++) {
            process.stdout.write(" ")
        }
        process.stdout.write("]")
        process.stdout.write("\x1B[?25h") // show cursor

        this.current = 1;
        readline.cursorTo(process.stdout, this.current, 1)

    }

    public addOne() {
        this.current++;
        readline.cursorTo(process.stdout, this.current, 1)
    }

    public setValue(value: number) {
        this.current = value;
        readline.cursorTo(process.stdout, this.current, 1)
        this.drawBar(value)
    }

    public clearLines(amount:number) {
        for (let i = 0; i < amount; i++) {
            readline.moveCursor(process.stdout, 0, -1)
            readline.clearLine(process.stdout, 0)
        }
    }

    public makeTable(data: any[]) {
        readline.cursorTo(process.stdout, 0, 2)
        console.table(data)
    }

    public log(progress: number, tableData: any[], message: string) {

        this.clearLines(8)
        readline.cursorTo(process.stdout, 0, 0)
        console.log(message + ` | ${progress}%`)
        this.setValue(progress)
        this.makeTable(tableData)
    }
    

    public drawBar(percentage: number) {
        readline.cursorTo(process.stdout, 0, 1)
        process.stdout.write("[")
        for (let i = 0; i < this.size - 2; i++) {
            if (i < this.percentageToSize(percentage)) {
                process.stdout.write("=")
            } else {
                process.stdout.write(" ")
            }
        }
        process.stdout.write("]")
    }

    private percentageToSize(percentage: number) {
        return Math.round(this.size * percentage / 100);
    }

}