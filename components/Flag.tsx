import Flag from "react-world-flags";

const FlagComponent = ({ countryCode }: { countryCode: string }) => {
  return (
    <Flag
      code={countryCode.toLowerCase()}
      style={{ width: "1.3rem", height: "1rem" }}
    />
  );
};

export default FlagComponent;
