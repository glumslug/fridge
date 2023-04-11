import convert, { Unit } from "convert-units";
type conversionMachineProps = {
  amount: number;
  source: Unit | undefined;
  target: Unit | undefined;
};

const conversionMachine = ({
  amount,
  source,
  target,
}: conversionMachineProps) => {
  if (source === undefined || target === undefined) {
    return 0;
  }
  if (source === target) {
    return amount;
  }
  let cf = convert(amount).from(source).to(target);
  return cf;
};

export default conversionMachine;
