const otpTemplate = (otp) => {
	return `<!DOCTYPE html>
	<html>
	
	<head>
		<meta charset="UTF-8">
		<title>OTP Verification Email</title>
		<style>
			body {
				background-color: #ffffff;
				font-family: Arial, sans-serif;
				font-size: 16px;
				line-height: 1.4;
				color: #333333;
				margin: 0;
				padding: 0;
			}
	
			.container {
				max-width: 600px;
				margin: 0 auto;
				padding: 20px;
				text-align: center;
			}
	
			.message {
				font-size: 20px;
				font-weight: bold;
				margin-bottom: 20px;
			}
	
			.body {
				font-size: 16px;
				margin-bottom: 20px;
			}
	
			.cta {
				display: inline-block;
				padding: 10px 20px;
				background-color: #1e90ff;
				color: #ffffff;
				text-decoration: none;
				border-radius: 5px;
				font-size: 16px;
				font-weight: bold;
				margin-top: 20px;
			}
	
			.support {
				font-size: 14px;
				color: #999999;
				margin-top: 20px;
			}
	
			.highlight {
				font-weight: bold;
				font-size: 24px;
				color: #1e90ff;
			}
		</style>
	
	</head>
	
	<body>
		<div class="container">
			<div class="message">Verify Your Email Address</div>
			<div class="body">
				<p>Hello Blogger,</p>
				<p>Welcome to <strong>BlogHub</strong> — your space to share, explore, and engage with insightful blogs.</p>
				<p>To activate your account, please enter the OTP provided below:</p>
				<h2 class="highlight">${otp}</h2>
				<p>This OTP is valid for the next 5 minutes. If you did not initiate this request, you may safely ignore this message.</p>
			</div>
			<div class="support">
				Need help? Reach us at <a href="mailto:support@bloghub.com">support@bloghub.com</a><br>
				Happy blogging! 🌟
			</div>
		</div>
	</body>
	
	</html>`;
};

module.exports = otpTemplate;
