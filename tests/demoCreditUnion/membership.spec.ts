import { test, expect } from "@playwright/test";
import { DEMO_CREDIT_UNION_CONFIG } from "../config/demoCreditUnion.ts";
import { AccessCodePage } from "../pages/accessCodePage.ts";
import { AgreementsPage } from "../pages/agreementPage.ts";
import { AccountPage } from "../pages/accountPage.ts";
import { ProductsPage } from "../pages/productsPage.ts";
import { ApplicantPage } from "../pages/applicantPage.ts";
import { LoanMFADialogPage } from "../pages/loanMFADialog.ts";
import { ReviewPage } from "../pages/reviewPage.ts";
import { FundingPage } from "../pages/fundingPage.ts";
import { ConfirmationPage } from "../pages/confirmationPage.ts";
import { OadminLogin } from "../pages/oadminLogIn.ts";
import { OadminApplicationsPage } from "../pages/oadminApplicationsPage.ts";
import { OadminApplicationDetailsPage } from "../pages/oadminApplicationDetailsPage.ts";
import { LoanSelectionPage } from "../pages/loanSelection.ts";
import { LoanPurposePage } from "../pages/loanPurpose.ts";
import { LoanCalculatorPage } from "../pages/loanCalculator.ts";
import { LoanFeaturesAndOptionsPage } from "../pages/loanFeaturesAndOptionsPage.ts";
import { LoanApplicantPage } from "../pages/loanApplicant.ts";
import { LoanApplicantScanIDPage } from "../pages/loanApplicantScanID.ts";
import { LoanApplicantPersonalPage } from "../pages/loanApplicantPersonal.ts";
import { LoanApplicantContactPage } from "../pages/loanApplicantContact.ts";
import { LoanApplicantIdentificationPage } from "../pages/loanApplicantIdentification.ts";
import { LoanApplicantAddressPage } from "../pages/loanApplicantAddress.ts";
import { LoanApplicantEmploymentPage } from "../pages/loanApplicantEmploymentPage.ts";
import { LoanApplicantReferencePage } from "../pages/loanReferencePage.ts";
import { LoanCoApplicantsDialog } from "../pages/components/loanCoApplicantsDialog.ts";
import { LoanDueDiligencePage } from "../pages/loanDueDiligencePage.ts";
import { LoanReviewPage } from "../pages/loanReviewPage.ts";
import { LoanSignAndSubmitDialog } from "../pages/components/loanSignAndSubmitDialog.ts";
import { LoanConfirmationPage } from "../pages/loanConfirmationPage.ts";

test.describe.serial("Demo CU membership + OAdmin verification", () => {
  let randomSSN: string; // shared between tests in this describe
  test("Demo Credit Union Membership Test", async ({ page }) => {
    test.setTimeout(180000);

    randomSSN = Math.floor(
      100_000_000 + Math.random() * 900_000_000,
    ).toString();
    const ACCESS_CODE = DEMO_CREDIT_UNION_CONFIG.accessCode;
    const access = new AccessCodePage(page); // create instance, give it your current browser tab
    await access.goto();
    await access.enterAccessCode(ACCESS_CODE);
    await access.submit(); // open Membership page

    //Agreements page
    const agreements = new AgreementsPage(page);
    await agreements.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.membership.agreements.heading,
    );
    await agreements.selectEligibilityCheckbox();
    await agreements.clickNext();
    //this needs to be refactored
    await agreements.selectElegibilityFromList();
    await agreements.clickNext();

    //Account Page
    const account = new AccountPage(page);
    await account.assertLoaded();

    await account.selectAccountByHeading(
      DEMO_CREDIT_UNION_CONFIG.membership.account.heading,
    );

    //product page
    const products = new ProductsPage(page);
    await products.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.membership.products.banner,
      DEMO_CREDIT_UNION_CONFIG.membership.products.saveProgress,
      DEMO_CREDIT_UNION_CONFIG.membership.products.offerCode,
    );

    await products.selectSubServices(
      DEMO_CREDIT_UNION_CONFIG.membership.products.subServices,
    );

    await products.clickNext();

    //Applicants Page
    const applicant = new ApplicantPage(page);
    await applicant.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.mainHeading,
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.bannerHeading,
    );
    await applicant.uploadIDFront(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.idFront,
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.uploadText,
    );
    await applicant.uploadIDBack(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.idBack,
    );
    await applicant.clickSubmitButton();
    await applicant.escapeAddressDialog();
    await applicant.assertLicenseUploaded();

    await applicant.assertLicenseDecoder(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.expectedValues,
    );
    await applicant.selectMaritalStatus(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.maritalStatus,
    );

    const personalValues = {
      ...DEMO_CREDIT_UNION_CONFIG.membership.applicant.personalValues,
      "#pri-tax-id-number": randomSSN,
    };

    await applicant.enterRequiredFields(personalValues);
    await applicant.selectEmploymentStatus(
      DEMO_CREDIT_UNION_CONFIG.membership.applicant.employment,
    );
    await applicant.clickNext();

    //mfa diolog
    const mfa = new LoanMFADialogPage(page);
    await mfa.assertMembershipLoaded();
    await mfa.assertMembershipErrormessage(
      DEMO_CREDIT_UNION_CONFIG.membership.MFA.errormessage,
    );
    await mfa.submitMembershipIncorrectPasscode(
      "123456",
      DEMO_CREDIT_UNION_CONFIG.membership.MFA.incorrectPasscodeError,
    );
    await mfa.submitMembershipCorrectPasscode("000000");

    //review page
    const review = new ReviewPage(page);
    await review.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.membership.review.heading,
    );
    await review.selectReferralSource(
      DEMO_CREDIT_UNION_CONFIG.membership.review.referralSource,
    );
    await review.checkAll();
    await review.clickNext();
    await review.signAndSubmitPrimaryOnly(
      DEMO_CREDIT_UNION_CONFIG.membership.review.reviewCheckbox,
    );

    //Funding Page
    const funding = new FundingPage(page);
    await funding.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.membership.funding.product,
    );
    await funding.clickNext();

    //Confirmation Page
    const confirmation = new ConfirmationPage(page);
    await confirmation.assertLoaded();
  });

  //second test here - oadmin verifiecation
  test("Demo Credit Union Verify App Approved", async ({ page }) => {
    test.setTimeout(180000);

    if (!randomSSN) {
      test.skip(true, "No SSN generated from membership test");
    }

    //Access code page
    const ACCESS_CODE = DEMO_CREDIT_UNION_CONFIG.accessCode;
    const access = new AccessCodePage(page); // create instance, give it your current browser tab
    await access.gotoOAdmin();
    await access.enterAccessCode(ACCESS_CODE);
    await access.submit();

    //oadmin login
    const login = new OadminLogin(page);
    await login.assertLoaded();
    await login.enterLogInCredentials();
    await login.clickLogIn();

    //Oadmin Dashboared
    const applications = new OadminApplicationsPage(page);
    await applications.assertLoaded();
    await applications.searchBySSN(randomSSN);
    await applications.openApplicationBySSN(randomSSN);

    //Oadmin application Details
    const appDetails = new OadminApplicationDetailsPage(page);
    await appDetails.assertLoaded();
    await appDetails.expectDecision(
      DEMO_CREDIT_UNION_CONFIG.Oadmin.approvedDecisionStatus,
    );
  });
});

test.describe.serial("Demo Credit Union loan + OAdmin verification", () => {
  let randomSSN: string; // shared between tests in this describe
  test("Demo Credit Union Submit Loan App", async ({ page }) => {
    //let randomSSN: string; // shared between tests in this describe
    test.setTimeout(70000);

    randomSSN = Math.floor(
      100_000_000 + Math.random() * 900_000_000,
    ).toString();

    const ACCESS_CODE = DEMO_CREDIT_UNION_CONFIG.accessCode;
    const access = new AccessCodePage(page);
    await access.goToLoan();
    await access.enterAccessCode(ACCESS_CODE);
    await access.submit(); // open loan page

    //Loan Selection Page
    const loanSelection = new LoanSelectionPage(page);
    await loanSelection.assertLoaded(
      DEMO_CREDIT_UNION_CONFIG.loan.selection.header,
    );
    await loanSelection.selectLoanCategory("Vehicles");
    await loanSelection.selectLoanType("Auto");

    //Loan Purpose Page
    const loanPurpose = new LoanPurposePage(page);
    await loanPurpose.assertLoaded();
    await loanPurpose.noRefinance();
    await loanPurpose.clickNext();

    //Loan Calculator Page
    const loanCalculator = new LoanCalculatorPage(page);

    await loanCalculator.assertLoaded([
      "Calculator",
      "Estimate your credit score",
      "Loan Amount or Credit limit",
      "Finance Rate",
      "Estimated Monthly Payment",
    ]);

    await loanCalculator.setCreditScore("720");
    await loanCalculator.setFinanceTerm("60");
    await loanCalculator.setLoanAmount(10000);
    await loanCalculator.selectToggleButton();
    await loanCalculator.clickNext();

    //Features and Options Page
    const features = new LoanFeaturesAndOptionsPage(page);
    await features.assertLoaded();
    await features.selectOneProduct("#checkbox-no-products-required");
    await features.clickNext();

    //Loan Applicant Page
    const loanApplicant = new LoanApplicantPage(page);
    await loanApplicant.assertLoaded(
      /Save time and login to pre-fill your application/i,
      [/Member Login/i, /I'm not yet/i],
    );

    await loanApplicant.selectMemberOrNonMember(/i'm not yet/i);

    //Loan Applicant Scan ID Page
    const loanApplicantScanID = new LoanApplicantScanIDPage(page);
    await loanApplicantScanID.assertLoaded(
      /If you have co-applicants, you will be prompted/i,
    );
    await loanApplicantScanID.clickOk();

    await loanApplicantScanID.assertConsentText([
      /Save time and scan your ID./i,
      /Driver's License or State-Issued ID Consent Agreement/i,
    ]);
    await loanApplicantScanID.clickAgreeOrEnterManually(/Agree/i);

    const frontImageFilePath =
      "C:\\Users\\lthayessqa\\Pictures\\delete\\monopoly2.png";
    const backImageFilePath =
      "C:\\Users\\lthayessqa\\Pictures\\delete\\nathan.png";
    await loanApplicantScanID.uploadFrontImage(frontImageFilePath);
    await loanApplicantScanID.uploadBackImage(backImageFilePath);

    await loanApplicantScanID.assertUIafterUpload();
    await loanApplicantScanID.clickNext();

    //Applicant Personal Page
    const loanApplicantPersonal = new LoanApplicantPersonalPage(page);
    await loanApplicantPersonal.assertLoaded({
      "#applicant-first-name": "Nathan",
      "#applicant-last-name": "Davidson",
      "#applicant-dob-date": "02/15/1965",
    });

    await loanApplicantPersonal.enterApplicantPersonalData({
      "#applicant-tax-id-number": randomSSN,
    });

    await loanApplicantPersonal.selectMaritalStatus(/Married/i);
    await loanApplicantPersonal.clickNext();

    //Applicant Contact Page
    const loanApplicantContact = new LoanApplicantContactPage(page);
    await loanApplicantContact.assertLoaded([
      /Primary Applicant: Contact Information/i,
    ]);
    await loanApplicantContact.enterContactInfo({
      "#CellPhone": "2813308004",
      "#HomePhone": "2813308004",
      "#WorkPhone": "2813308004",
      "#Email": "lthayessqa@ecutechnology.com",
    });
    await loanApplicantContact.clickNext();

    //MFA Dialog Page
    const loanMFADiolog = new LoanMFADialogPage(page);
    const incorrectPasscode = "123456";
    const correctPasscode = "000000";
    await loanMFADiolog.assertLoaded();
    await loanMFADiolog.assertErrorMessage();
    await loanMFADiolog.submitIncorrectPasscode(incorrectPasscode);
    await loanMFADiolog.submitCorrectPasscode(correctPasscode);

    //Applicant Identification Page
    const loanApplicantIdentification = new LoanApplicantIdentificationPage(
      page,
    );
    await loanApplicantIdentification.assertLoaded(
      [/Primary Applicant: Identification/i],
      {
        "Driver's License Number": "036339068",
        "Issued On": "12/02/2021",
        "Expires On": "12/02/2070",
      },
    );
    await loanApplicantIdentification.clickNext();

    //Applicant Address Page
    const applicantAddress = new LoanApplicantAddressPage(page);
    await applicantAddress.assertLoaded(/Primary Applicant: Residence/i, {
      "Residential Address (cannot be a PO Box)":
        "831 Sw Zachary Walks Crest E",
      "City": "Lake Patriciabury",
      "Zip code": "83192-1200",
    });
    await applicantAddress.enterRequiredFields({
      "Years at Address": "4",
      "Months at Address": "8",
      "Monthly Housing Expense": "1000",
    });

    await applicantAddress.selectDropDownValues({
      "Residence Type": "Own",
    });
    await applicantAddress.clickNext();

    //Applicant Employment Page
    const applicantEmployment = new LoanApplicantEmploymentPage(page);
    await applicantEmployment.assertLoaded(/Employment/i);
    await applicantEmployment.enterRequiredFields({
      "Employer Name": "eCU",
      "Business Address": "16430 Park Ten Pl",
      "Zip Code": "77084",
      "Job Title": "Tester",
      "Monthly Gross Salary (pre- tax)": "1000",
      "Years Employed": "8",
    });

    await applicantEmployment.clickNext();

    //reference page
    const references = new LoanApplicantReferencePage(page);
    await references.enterRequiredFields({
      "Name": "John Doe",
      "Relation": "Child", // will be detected as combobox
      "Phone Number": "2813308004",
    });
    await references.clickNext();

    //Add co-app? dialog
    const coApplicantDialog = new LoanCoApplicantsDialog(page);
    await coApplicantDialog.proceedtoDueDiligence();

    //Due Diligence Page
    const dueDiligence = new LoanDueDiligencePage(page);
    await dueDiligence.answerQuestions({
      "Are you a U.S citizen or permanent resident alien?": "Yes",
      "Do you currently have an outstanding judgments or have you ever filed for bankruptcy?":
        "No",
      "Have you had a debt adjustment plan confirmed under chapter 13, had property foreclosed upon or repossessed in the last 7 years or been a party in a lawsuit?":
        "No",
      "Are you a Comaker, Co-signer, or Guarantor on any loan not listed?":
        "No",
    });
    await dueDiligence.clickNext();

    //Loan Review Page
    const review = new LoanReviewPage(page);
    await review.selectReferral(/Family/);
    await review.clickNext();

    //Sign and Submit modal
    const submit = new LoanSignAndSubmitDialog(page);
    await submit.autoSignApplication();

    //Loan Confirmation Page
    const confirmation = new LoanConfirmationPage(page);
    await confirmation.assertLoaded();
  });

  //oadmin test here

  test("Demo Credit Union Approve Loan App", async ({ page }) => {
    test.setTimeout(180000);

    //for quick debugig i need to remove the test case from pulling the SSN from the first test in this group.
    //when test case is done, un comment the IF statement below and update the test to pull the randomSSN constant

    if (!randomSSN) {
      test.skip(true, "No SSN generated from loan test");
    }

    //Access code page
    const ACCESS_CODE = DEMO_CREDIT_UNION_CONFIG.accessCode;
    const access = new AccessCodePage(page); // create instance, give it your current browser tab
    await access.gotoOAdmin();
    await access.enterAccessCode(ACCESS_CODE);
    await access.submit();

    //oadmin login
    const login = new OadminLogin(page);
    await login.assertLoaded();
    await login.enterLogInCredentials();
    await login.clickLogIn();

    //Oadmin Dashboared
    const applications = new OadminApplicationsPage(page);
    await applications.assertLoaded();

    //when test case is complete, chjange the step below to pull the randomSSN constant from the first test.
    await applications.searchBySSN(randomSSN);
    await applications.openApplicationBySSN(randomSSN);

    //app manager
    const appManager = new OadminApplicationDetailsPage(page);
    await appManager.handleCreditErrorIfPresent();
    await appManager.decisionApplication(
      DEMO_CREDIT_UNION_CONFIG.Oadmin.approvedDecisionStatus,
    );
    await appManager.enterAccountNumber();
    await appManager.fillFundingForm({
      amount: "10000",
      source: "Loan",
      destination: "Existing Share",
      accountNumber: "7018915",
      shareId: "01",
    });

    await appManager.clickSave();
    await appManager.completeFundingStep();
    await appManager.expectLoadingAnimation();
    await appManager.expectApplicationClosed();
  });
});
