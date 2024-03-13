class GenerateOTP {
    generateOtp() {
        let OTP = '';
        for (let i = 0; i < 4; i++) {
            const randomIndex = Math.floor(Math.random() * 10);
            OTP += randomIndex;
        }
        return OTP;
    }
}

export default GenerateOTP;