import { makeAutoObservable } from "mobx";

export type FundraiserDocType = {
  id: string;
  creatorId: string;
  title: string;
  isActive: boolean;
  goalAmount: number;
  currentAmount: number;
  finalDay: string;
  description: string;
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
    return number % 1 === 0 ? number : number.toFixed(2);
  }

  setActiveFundraiserDescription(description: string) {
    if (this.activeFundraiser) {
      this.activeFundraiser.description = description;
    }
  }
}

const fundraiserState = new FundraiserState();
export default fundraiserState;
