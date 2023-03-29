import convert, { Unit } from "convert-units";
type conversionMachineProps = {
  amount: number;
  source: Unit | null | undefined;
  target: Unit | null | undefined;
};

const conversionMachine = ({
  amount,
  source,
  target,
}: conversionMachineProps) => {
  console.log(amount, source, target);
  if (source === undefined || target === undefined) {
    console.log("no cart or home items");
    return 0;
  }
  if (source === target) {
    console.log("same unit, no conversion needed");
    return amount;
  }
  if (source === null || target === null) {
    console.log("non-unit unit, e.g. clove or pinch");
    return amount;
  }
  let cf = convert(amount).from(source).to(target);
  console.log("converted");
  return cf;
};

export default conversionMachine;
