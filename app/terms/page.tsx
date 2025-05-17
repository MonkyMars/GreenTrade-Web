import { NextPage } from "next";
import Link from "next/link";
import { FaBook, FaCreditCard, FaUserLock, FaBalanceScale, FaExclamationTriangle } from "react-icons/fa";

const TermsPage: NextPage = () => {
	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white dark:bg-gray-900 border-t-4 border-t-green-500 dark:border-t-green-600 border-b border-l border-r border-gray-200 dark:border-gray-800 p-8 rounded-md mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
							<FaBook className="mr-3 text-green-600 dark:text-green-500" />
							Terms and Conditions
						</h1>

						<div className="prose prose-green dark:prose-invert max-w-none">							<p className="text-gray-600 dark:text-gray-300 mb-8">
							Welcome to GreenVue. These Terms and Conditions govern your use of the GreenVue platform and services.
							Please read these terms carefully before using our services. By accessing or using GreenVue, you agree
							to be bound by these Terms and Conditions.
						</p>							<div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 mb-8">
								<p className="text-amber-800 dark:text-amber-300 flex items-start">
									<FaExclamationTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
									<span>
										Last updated: May 17, 2025. These terms replace all previous versions. We may update these terms periodically,
										so please check back regularly for changes. GreenVue is a non-commercial service operated by an individual.
									</span>
								</p>
							</div>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="definitions">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">1</span>
									Definitions
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4">
										<li><strong>&quot;GreenVue&quot;</strong>, <strong>&quot;we&quot;</strong>, <strong>&quot;us&quot;</strong>, or <strong>&quot;our&quot;</strong> refers to the GreenVue platform and its sole operator, a non-commercial individual.</li>
										<li><strong>&quot;Platform&quot;</strong> refers to the GreenVue website, mobile applications, and related services.</li>
										<li><strong>&quot;User&quot;</strong>, <strong>&quot;you&quot;</strong>, or <strong>&quot;your&quot;</strong> refers to individuals who use our services, whether as buyers or sellers.</li>
										<li><strong>&quot;Listings&quot;</strong> refers to products or services offered for sale on the Platform.</li>
										<li><strong>&quot;Content&quot;</strong> refers to text, images, videos, audio, and other materials displayed on the Platform.</li>
									</ul>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="account">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">2</span>
									User Accounts
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">2.1 Account Creation</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										To use certain features of the Platform, you must create an account. You agree to provide accurate, current, and complete information during the registration process and to update such information to keep it accurate, current, and complete.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">2.2 Account Security</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										You are responsible for safeguarding your password and for all activities that occur under your account. You agree to notify us immediately of any unauthorized use of your account.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">2.3 Account Termination</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We reserve the right to suspend or terminate your account at our sole discretion, without notice, for conduct that we believe violates these Terms or is harmful to other users, us, or third parties, or for any other reason.
									</p>
								</div>
							</section>

							<section className="mb-10">								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="listings">
								<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">3</span>
								Listings and Transactions
							</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.1 Listing Content</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Sellers are responsible for the accuracy and content of their listings. All listings must comply with our guidelines and applicable laws and regulations.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.2 Prohibited Items</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										The following items are prohibited from being listed on the Platform: illegal goods, dangerous or hazardous materials, counterfeit items, stolen goods, and any items that infringe upon the rights of third parties.
									</p>									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.3 In-Person Transactions</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue is a platform that facilitates connections between buyers and sellers. <strong>All transactions occur in-person between users and are not processed through GreenVue.</strong> Users are solely responsible for arranging meetings, inspecting items, and completing payment transactions directly with each other.
									</p>
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.4 Transaction Conduct</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Users agree to conduct transactions in good faith. Buyers agree to pay for items they commit to purchase, and sellers agree to deliver items as described in their listings. GreenVue recommends meeting in safe, public locations for transactions and taking appropriate safety precautions.
									</p>
									<div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 mb-4">
										<p className="text-amber-800 dark:text-amber-300 flex items-start">
											<FaExclamationTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
											<span>
												<strong>Safety Warning:</strong> GreenVue does not verify user identities or guarantee the quality or safety of items. Users should exercise caution when meeting others and inspect items thoroughly before completing transactions.
											</span>
										</p>
									</div>
								</div>
							</section>							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="payments">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">4</span>
									Platform Fees and Payment Disclaimer
									<FaCreditCard className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.1 No Payment Processing</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										<strong>GreenVue does not process payments between users.</strong> All financial transactions occur directly between buyers and sellers outside of the GreenVue platform. We do not offer payment processing, escrow services, or financial protection for transactions.
									</p>
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.2 Platform Service Fees</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue is a non-commercial service and does not charge fees for the use of its basic platform services. In the future, we may introduce optional premium services, but basic listing and viewing functionalities will remain free of charge.
									</p>									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.3 Transaction Responsibility</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Users are solely responsible for handling all aspects of their transactions, including negotiation, payment method, receipt verification, and any applicable taxes or fees. GreenVue recommends using secure payment methods and providing receipts for completed transactions.
									</p>
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.4 Disputes and Refunds</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Since GreenVue does not process payments, we cannot directly facilitate refunds. Any payment disputes must be resolved directly between the buyer and seller. While GreenVue may offer a messaging system to facilitate communication regarding disputes, we do not guarantee resolution or provide financial compensation for unsuccessful transactions.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="privacy">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">5</span>
									Privacy and Data
									<FaUserLock className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Your privacy is important to us. Our Privacy Policy explains how we collect, use, and protect your personal information. By using GreenVue, you consent to the data practices described in our Privacy Policy.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">5.1 GDPR Compliance</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										For users in the European Economic Area (EEA), we comply with the General Data Protection Regulation (GDPR). This includes providing you with certain rights regarding your personal data, such as the right to access, correct, delete, restrict processing, and portability of your data. For more information on how to exercise these rights, please contact us using the information in the &quot;Contact Us&quot; section.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">5.2 Data Export</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Users may request an export of their personal data and activity history at any time. We will provide this information in a structured, commonly used and machine-readable format.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">5.3 Third-Party Authentication</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue offers authentication through Google login. When you use Google to sign in, we receive certain information from your Google account based on your Google privacy settings. We use this information solely for authentication purposes and in accordance with our Privacy Policy.
									</p>

									<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md">
										<p className="text-gray-600 dark:text-gray-300">
											For full details on how we handle your data, please review our
											<Link href="/privacy" className="text-green-600 dark:text-green-500 hover:underline mx-1">
												Privacy Policy
											</Link>
											which constitutes a part of these Terms.
										</p>
									</div>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="intellectual">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">6</span>
									Intellectual Property
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">6.1 GreenVue Content</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										All content provided by GreenVue, including but not limited to graphics, logos, and text, is the property of GreenVue or its content suppliers and is protected by international copyright laws.
									</p>									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">6.2 User Content</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										By posting content on GreenVue, you grant us a non-exclusive, worldwide, royalty-free license to use, copy, modify, and display that content in connection with the services we provide and for promotional purposes.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">6.3 Copyright Infringement</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										If you believe your intellectual property rights have been infringed, please contact our designated copyright agent with a notice that includes the required information under the Digital Millennium Copyright Act.
									</p>
								</div>
							</section>							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="limitations">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">7</span>
									Limitation of Liability
									<FaBalanceScale className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">									<p className="text-gray-600 dark:text-gray-300 mb-4">
									To the maximum extent permitted by law, GreenVue shall not be liable for any indirect, incidental, special, consequential, or punitive damages, or any loss of profits or revenues, whether incurred directly or indirectly, or any loss of data, use, goodwill, or other intangible losses, resulting from:
								</p>

									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li>Your use of or inability to use the Platform;</li>
										<li>Any unauthorized access to or use of our servers and/or any personal information stored therein;</li>
										<li>Any interruption or cessation of transmission to or from the Platform;</li>
										<li><strong>Any in-person meetings, transactions, or interactions between users of the Platform;</strong></li>
										<li><strong>Quality, safety, legality, or any other aspect of items exchanged between users;</strong></li>
										<li><strong>Financial losses or disputes resulting from transactions between users;</strong></li>
										<li>Any bugs, viruses, or other harmful code that may be transmitted through the Platform.</li>
									</ul>									<p className="text-gray-600 dark:text-gray-300 mb-4">
										<strong>GreenVue is solely a platform connecting buyers and sellers and is not a party to any transaction between users. We do not guarantee the quality, safety, or legality of listed items, the truth or accuracy of listings, the ability of sellers to sell items, the ability of buyers to pay for items, or that a buyer and seller will actually complete a transaction or return an item.</strong>
									</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										In no event shall our total liability to you for all claims exceed the amount paid by you, if any, for using our services during the twelve (12) months prior to the claim.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="disclaimers">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">8</span>
									Disclaimers
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">									<p className="text-gray-600 dark:text-gray-300 mb-4">
									The Platform is provided &quot;as is&quot; and &quot;as available&quot; without warranties of any kind, either express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, or non-infringement.
								</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue does not warrant that the Platform will be uninterrupted or error-free, that defects will be corrected, or that the Platform or the servers that make it available are free of viruses or other harmful components.
									</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue is not responsible for the conduct, whether online or offline, of any user of the Platform.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="governing">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">9</span>
									Governing Law
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">									<p className="text-gray-600 dark:text-gray-300 mb-4">
									These Terms shall be governed by and construed in accordance with the laws of the European Union and applicable member state laws, without regard to conflict of law provisions.
								</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										For users located in the European Union, any dispute arising from or relating to these Terms may be subject to the jurisdiction of courts in the respective member state where the user is located, in accordance with EU consumer protection laws.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="changes">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">10</span>
									Changes to Terms
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We reserve the right to modify these Terms at any time. If we make changes, we will provide notice of such changes, such as by sending an email, providing a notice through the Platform, or updating the date at the top of these Terms.
									</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Your continued use of the Platform following the posting of revised Terms means that you accept and agree to the changes.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="contact">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">11</span>
									Contact Us
								</h2>								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										If you have any questions about these Terms, please contact us at:
									</p>

									<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md">
										<p className="text-gray-700 dark:text-gray-300">
											Email: <a href="mailto:contact@greenvue.eu" className="text-green-600 dark:text-green-500 hover:underline">contact@greenvue.eu</a>
										</p>
										<p className="text-gray-700 dark:text-gray-300 mt-2">
											GreenVue is operated by an individual based in the European Union.
										</p>
									</div>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-6 mb-2">11.1 Non-Commercial Status</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue is a non-commercial service operated by a single individual. The service is provided as a community resource without profit motive. As a non-commercial entity, certain consumer protection provisions may apply differently than they would to commercial services.
									</p>
								</div>
							</section>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-md flex justify-between items-center">						<p className="text-gray-600 dark:text-gray-300">
						By using GreenVue, you acknowledge that you have read, understood, and agree to these Terms and Conditions.
					</p>
						<Link href="/" className="bg-green-600 hover:bg-green-700 text-white dark:bg-green-700 dark:hover:bg-green-800 px-4 py-2 rounded-md border border-green-600 dark:border-green-700 transition-colors">
							Return Home
						</Link>
					</div>
				</div>
			</div>
		</div>
	)
}

export default TermsPage;