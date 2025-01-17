import { makeAutoObservable } from "mobx";
import appState from "./AppState";

export type DonationType = {
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
  confirmedDonations: DonationType[];
  pendingDonations: DonationType[];
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

  handleEditDonation(donation: DonationType) {
    console.log("State Edit:", donation);
    // Implement edit functionality here
  }

  handleMakeDonationPending(donation: DonationType) {
    console.log("State Make Pending:", donation);
    // Implement make pending functionality here
  }

  handleConfirmDonation(donation: DonationType) {
    console.log("State Confirm:", donation);
    // Implement confirm functionality here
  }

  handleDeleteDonation(donation: DonationType) {
    if (confirm("Are you sure you want to delete this donation?")) {
      console.log("State Delete:", donation);
    }
  }
}

const fundraiserState = new FundraiserState();
export default fundraiserState;
