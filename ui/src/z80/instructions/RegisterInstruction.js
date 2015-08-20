import Instruction from './Instruction';
import Transition from '../Transition';

export default class RegisterInstruction extends Instruction {
    constructor(opcode, name, register, operation) {
        super(opcode, name, [register]);
        this.register = register;
        this.byte = register.length === 1;
        this.operation = operation;
    }

    createAssembler() {
        return {
            type: 'instruction',
            assembler: `${this.name}\t${this.register}`,
            opcodes: () => this.opcodes,
            size: this.size
        };
    }

    process(state) {
        const result = this.operation(state.registers[this.register], state);
        if (this.byte) {
            return new Transition().
                withWordRegister('PC', state.registers.PC + this.size).
                withByteRegisterAndFlags(this.register, result);
        }
        return new Transition().
            withWordRegister('PC', state.registers.PC + this.size).
            withWordRegister(this.register, result);
    }
}
