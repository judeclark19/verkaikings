import fundraiserState from "@/lib/FundraiserState";
import { observer } from "mobx-react-lite";

const Donor = observer(() => {
  if (!fundraiserState.activeFundraiser) {
    return null;
  }

  const { description } = fundraiserState.activeFundraiser;

  return (
    <>
      <div>donor view</div>

      <div>description: {description}</div>
    </>
  );
});

export default Donor;
