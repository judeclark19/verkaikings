import { makeAutoObservable } from "mobx";
import appState from "./AppState";

type Donation = {
  id: string;
  userId: string;
  amount: number;
};

export type FundraiserDocType = {
  id: string;
  creatorId: string;
  title: string;
  isActive: boolean;
  goalAmount: number;
  currentAmount: number;
  finalDay: string;
  description: string;
  instructions: string;
  confirmedDonations: Donation[];
  pendingDonations: Donation[];
};

export class FundraiserState {
  fundraisersData: FundraiserDocType[] = [];
  activeFundraiser: FundraiserDocType | null = null;

  constructor() {
    console.log("FundraiserState constructor");
    makeAutoObservable(this);
  }

  setFundraisers(data: any) {
    this.fundraisersData = data;

    let activeFundraiser = this.fundraisersData.find(
      (fundraiser) => fundraiser.isActive
    );

    if (activeFundraiser) {
      this.activeFundraiser = activeFundraiser;
    }
    console.log("active fundraiser", this.activeFundraiser);
  }

  get progress() {
    if (!this.activeFundraiser) {
      return 0;
    }
    const { currentAmount, goalAmount } = this.activeFundraiser;
    return (currentAmount / goalAmount) * 100;
  }

  get currentAmount() {
    if (!this.activeFundraiser) {
      return 0;
    }
    return this.formatNumberToCurrency(this.activeFundraiser?.currentAmount);
  }

  get goalAmount() {
    if (!this.activeFundraiser) {
      return 0;
    }
    return this.formatNumberToCurrency(this.activeFundraiser?.goalAmount);
  }

  formatNumberToCurrency(number: number) {
    return new Intl.NumberFormat(appState.language, {
      minimumFractionDigits: number % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(number);
  }

  setActiveFundraiserDescription(description: string) {
    if (this.activeFundraiser) {
      this.activeFundraiser.description = description;
    }
  }

  setActiveFundraiserInstructions(instructions: string) {
    if (this.activeFundraiser) {
      this.activeFundraiser.instructions = instructions;
    }
  }
}

const fundraiserState = new FundraiserState();
export default fundraiserState;
