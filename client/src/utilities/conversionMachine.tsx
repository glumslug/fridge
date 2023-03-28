import convert, { Unit } from "convert-units";
type conversionMachineProps = {
  amount: number;
  source: Unit | null;
  target: Unit | null;
};

const conversionMachine = ({
  amount,
  source,
  target,
}: conversionMachineProps) => {
  console.log(amount, source, target);
  if (source === null || target === null) {
    return 0;
  }
  if (source === target) {
    return amount;
  }
  let cf = convert(amount).from(source).to(target);
  return cf;
};

export default conversionMachine;
