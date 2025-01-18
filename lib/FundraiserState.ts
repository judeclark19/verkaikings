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

export class FundraiserState {
  fundraisersData: FundraiserDocType[] = [];
  activeFundraiser: FundraiserDocType | null = null;
  activeFundraiserDoc: DocumentReference | null = null;

  constructor() {
    makeAutoObservable(this);
  }

  setFundraisers(data: FundraiserDocType[]) {
    this.fundraisersData = data;

    const activeFundraiser = this.fundraisersData.find(
      (fundraiser) => fundraiser.isActive
    );

    if (activeFundraiser) {
      this.activeFundraiser = activeFundraiser;
      this.activeFundraiserDoc = doc(
        db,
        "fundraisers",
        this.activeFundraiser.id
      );
    }
  }

  get progress() {
    if (!this.activeFundraiser) {
      return 0;
    }
    return (this.parsedCurrentAmount / this.activeFundraiser.goalAmount) * 100;
  }

  get currentAmount() {
    if (!this.activeFundraiser) {
      return 0;
    }
    return this.formatNumberToCurrency(
      this.activeFundraiser?.confirmedDonations.reduce(
        (acc, donation) => acc + donation.amount,
        0
      )
    );
  }

  get parsedCurrentAmount() {
    if (!this.activeFundraiser) {
      return 0;
    }
    return this.activeFundraiser?.confirmedDonations.reduce(
      (acc, donation) => acc + donation.amount,
      0
    );
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

  async handleMakeDonationPending(donation: DonationType) {
    try {
      await updateDoc(this.activeFundraiserDoc!, {
        pendingDonations: this.activeFundraiser?.pendingDonations
          ? [...this.activeFundraiser.pendingDonations, donation]
          : [donation],
        confirmedDonations: this.activeFundraiser?.confirmedDonations.filter(
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
        confirmedDonations: this.activeFundraiser?.confirmedDonations
          ? [...this.activeFundraiser.confirmedDonations, donation]
          : [donation],
        pendingDonations: this.activeFundraiser?.pendingDonations.filter(
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

  async handleDeletePendingDonation(donation: DonationType) {
    if (confirm("Are you sure you want to delete this donation?")) {
      try {
        await updateDoc(this.activeFundraiserDoc!, {
          pendingDonations: this.activeFundraiser?.pendingDonations.filter(
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

  async handleDeleteConfirmedDonation(donation: DonationType) {
    if (confirm("Are you sure you want to delete this donation?")) {
      try {
        await updateDoc(this.activeFundraiserDoc!, {
          confirmedDonations: this.activeFundraiser?.confirmedDonations.filter(
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
        confirmedDonations: this.activeFundraiser?.confirmedDonations.map(
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
        pendingDonations: this.activeFundraiser?.pendingDonations.map(
          (pendingDonation) => {
            if (pendingDonation.userId === donation.userId) {
              return { ...pendingDonation, amount: newAmount };
            }
            return pendingDonation;
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
}

const fundraiserState = new FundraiserState();
export default fundraiserState;
