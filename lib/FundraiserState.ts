import { makeAutoObservable } from "mobx";
import appState from "./AppState";
import { doc, DocumentReference, updateDoc } from "firebase/firestore";
import { db } from "./firebase";

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

export class Fundraiser {
  data: FundraiserDocType;
  activeFundraiserDoc: DocumentReference | null = null;

  constructor(fundraiser: FundraiserDocType) {
    makeAutoObservable(this);
    this.data = fundraiser;
    this.activeFundraiserDoc = doc(db, "fundraisers", fundraiser.id);
  }

  get currentAmount() {
    if (
      !this.data.confirmedDonations ||
      this.data.confirmedDonations.length === 0
    ) {
      return 0;
    }

    return this.formatNumberToCurrency(
      this.data.confirmedDonations.reduce(
        (acc, donation) => acc + donation.amount,
        0
      )
    );
  }

  get goalAmount() {
    return this.formatNumberToCurrency(this.data.goalAmount);
  }

  get parsedCurrentAmount() {
    if (
      !this.data.confirmedDonations ||
      this.data.confirmedDonations.length === 0
    ) {
      return 0;
    }
    return this.data.confirmedDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
  }

  get progress() {
    return (this.parsedCurrentAmount / this.data.goalAmount) * 100;
  }

  formatNumberToCurrency(number: number) {
    return new Intl.NumberFormat(appState.language, {
      minimumFractionDigits: number % 1 === 0 ? 0 : 2,
      maximumFractionDigits: 2
    }).format(number);
  }

  setFundraiserDescription(description: string) {
    this.data.description = description;
  }

  setFundraiserInstructions(instructions: string) {
    this.data.instructions = instructions;
  }

  async handleMakeDonationPending(donation: DonationType) {
    try {
      await updateDoc(this.activeFundraiserDoc!, {
        pendingDonations: this.data.pendingDonations
          ? [...this.data.pendingDonations, donation]
          : [donation],
        confirmedDonations: this.data.confirmedDonations.filter(
          (confirmedDonation) => confirmedDonation.userId !== donation.userId
        )
      });

      appState.setSnackbarMessage("Donation made pending.");
    } catch (err) {
      console.error("Error making donation pending:", err);
      appState.setSnackbarMessage(
        "Error making donation pending. Please try again."
      );
    }
  }

  async handleConfirmDonation(donation: DonationType) {
    try {
      await updateDoc(this.activeFundraiserDoc!, {
        confirmedDonations: this.data.confirmedDonations
          ? [...this.data.confirmedDonations, donation]
          : [donation],
        pendingDonations: this.data.pendingDonations.filter(
          (pendingDonation) => pendingDonation.userId !== donation.userId
        )
      });

      appState.setSnackbarMessage("Donation confirmed.");
    } catch (error) {
      console.error("Error confirming donation:", error);
      appState.setSnackbarMessage(
        "Error confirming donation. Please try again."
      );
    }
  }

  async handleDeleteConfirmedDonation(donation: DonationType) {
    if (confirm("Are you sure you want to delete this donation?")) {
      try {
        await updateDoc(this.activeFundraiserDoc!, {
          confirmedDonations: this.data.confirmedDonations.filter(
            (confirmedDonation) => confirmedDonation.userId !== donation.userId
          )
        });

        appState.setSnackbarMessage("Donation deleted.");
      } catch (error) {
        console.error("Error deleting donation:", error);
        appState.setSnackbarMessage(
          "Error deleting donation. Please try again."
        );
      }
    }
  }

  async updateConfirmedDonationAmount(
    donation: DonationType,
    newAmount: number
  ) {
    try {
      await updateDoc(this.activeFundraiserDoc!, {
        confirmedDonations: this.data.confirmedDonations.map(
          (confirmedDonation) => {
            if (confirmedDonation.userId === donation.userId) {
              return { ...confirmedDonation, amount: newAmount };
            }
            return confirmedDonation;
          }
        )
      });

      appState.setSnackbarMessage("Donation amount updated.");
    } catch (error) {
      console.error("Error updating donation amount:", error);
      appState.setSnackbarMessage(
        "Error updating donation amount. Please try again."
      );
    }
  }

  async updatePendingDonationAmount(donation: DonationType, newAmount: number) {
    try {
      await updateDoc(this.activeFundraiserDoc!, {
        pendingDonations: this.data.pendingDonations.map((pendingDonation) => {
          if (pendingDonation.userId === donation.userId) {
            return { ...pendingDonation, amount: newAmount };
          }
          return pendingDonation;
        })
      });

      appState.setSnackbarMessage("Donation amount updated.");
    } catch (error) {
      console.error("Error updating donation amount:", error);
      appState.setSnackbarMessage(
        "Error updating donation amount. Please try again."
      );
    }
  }

  async handleDeletePendingDonation(donation: DonationType) {
    if (confirm("Are you sure you want to delete this donation?")) {
      try {
        await updateDoc(this.activeFundraiserDoc!, {
          pendingDonations: this.data.pendingDonations.filter(
            (pendingDonation) => pendingDonation.userId !== donation.userId
          )
        });

        appState.setSnackbarMessage("Donation deleted.");
      } catch (error) {
        console.error("Error deleting donation:", error);
        appState.setSnackbarMessage(
          "Error deleting donation. Please try again."
        );
      }
    }
  }
}

export class FundraiserState {
  fundraisersData: FundraiserDocType[] = [];
  activeFundraisers: Fundraiser[] = [];
  pastFundraisers: Fundraiser[] = [];

  constructor() {
    makeAutoObservable(this);
  }

  setFundraisers(data: FundraiserDocType[]) {
    this.activeFundraisers = [];
    this.pastFundraisers = [];
    this.fundraisersData = data;

    this.fundraisersData.forEach((fundraiser) => {
      if (fundraiser.isActive) {
        this.activeFundraisers.push(new Fundraiser(fundraiser));
      } else {
        this.pastFundraisers.push(new Fundraiser(fundraiser));
      }
    });
  }
}

const fundraiserState = new FundraiserState();
export default fundraiserState;
