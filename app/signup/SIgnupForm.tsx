
  // Ensure `phoneData.inputValue` is up-to-date when moving to step 2
  useEffect(() => {
    if (signupStage === 2) {
      console.log("Stage 2: Phone input value:", phoneData.inputValue);
    }
  }, [signupStage, phoneData]);
