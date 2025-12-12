import path from "path";
export const DEMO_CREDIT_UNION_CONFIG = {
  accessCode: process.env.DEMO_CREDIT_UNION_CODE!,
  membership: {
    agreements: {
      heading: /Welcome! Applying only takes about 5 minutes/i,
    },
    account: {
      heading: /Personal or Joint/i,
    },
    products: {
      banner: /Choose Your Accounts/i,
      saveProgress: /Save Progress/i,
      offerCode: /LHayes was here/i,
      subServices: [
        { selector: "#sub-services-checkbox-div-9", answer: /No/i },
        { selector: "#sub-services-checkbox-div-6", answer: /No/i },
      ],
    },
    applicant: {
      mainHeading: /Primary Applicant/i,
      bannerHeading: /Primary Applicant/i,
      idFront: path.resolve(__dirname, "../assets/ids/monopoly2.png"),
      idBack: path.resolve(__dirname, "../assets/ids/nathan.png"),
      uploadText: /take a picture of your driver/i,

      expectedValues: {
        "#pri-first-name": "Nathan",
        "#pri-last-name": "Davidson",
        "#pri-date-of-birth": "02/15/1965",
        "#pri-street-address": "831 Sw Zachary Walks Crest E",
        "#pri-state": "TN",
        "#pri-identification-type-issuer-DriversLicense-1-0": "TN",
        "#pri-identification-type-value-DriversLicense-1-0": "036339068",
        "#pri-identification-issue-date-DriversLicense-1-0": "12/02/2021",
        "#pri-identification-expiration-date-DriversLicense-1-0": "12/02/2070",
      },
      maritalStatus: "Married",

      personalValues: {
        "#pri-cell-phone": "(281) 330-8004",
        "#pri-home-phone": "(281) 330-8004",
        "#pri-email-address": "lthayessqa@ecutechnology.com",
      },
      employment: "Disabled",
    },
    MFA: {
      errormessage: /An unknown error occurred/i,
      incorrectPasscodeError:
        /Unable to verify Multi-Factor Authentication code/i,
    },
    review: {
      heading: /Review Your Information/i,
      referralSource: "Family or Friend",
      reviewCheckbox: /I have reviewed this page/i,
    },
    funding: {
      product: /One Checking/i,
    },
  },
  Oadmin: {
    accountNumber: "7018915",
    approvedDecisionStatus: "Approved",
  },
  loan: {
    selection: {
      header: /What type of loan would you like to apply for/i,
    },
  },
};
