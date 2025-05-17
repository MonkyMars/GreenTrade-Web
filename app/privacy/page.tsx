import { NextPage } from "next";
import Link from "next/link";
import { FaShieldAlt, FaUserCircle, FaCookieBite, FaDatabase, FaExclamationTriangle, FaGlobe } from "react-icons/fa";

const PrivacyPage: NextPage = () => {
	return (
		<div className="min-h-screen py-12">
			<div className="container mx-auto px-4 py-12">
				<div className="max-w-4xl mx-auto">
					<div className="bg-white dark:bg-gray-900 border-t-4 border-t-green-500 dark:border-t-green-600 border-b border-l border-r border-gray-200 dark:border-gray-800 p-8 rounded-md mb-6">
						<h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 flex items-center">
							<FaShieldAlt className="mr-3 text-green-600 dark:text-green-500" />
							Privacy Policy
						</h1>

						<div className="prose prose-green dark:prose-invert max-w-none">
							<p className="text-gray-600 dark:text-gray-300 mb-8">
								Welcome to GreenVue. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our platform.
								Please read this privacy policy carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
							</p>

							<div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 mb-8">
								<p className="text-amber-800 dark:text-amber-300 flex items-start">
									<FaExclamationTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
									<span>
										Last updated: May 17, 2025. GreenVue is a non-commercial service operated by an individual based in the European Union.
									</span>
								</p>
							</div>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="collection">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">1</span>
									Information We Collect
									<FaUserCircle className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">1.1 Personal Data</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We may collect personal information that you voluntarily provide when using our Platform, including:
									</p>
									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li>Account information (name, email address, password)</li>
										<li>Profile information (profile picture, location, contact details)</li>
										<li>Communication data (messages sent through our platform)</li>
										<li>Listing information (descriptions, prices, images of items you list)</li>
										<li>When using Google Sign-In, we receive basic profile information from your Google account</li>
									</ul>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">1.2 Usage Data</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We use Vercel Analytics to collect anonymous usage data about how visitors interact with our platform:
									</p>
									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li>Basic anonymous metrics (page views, site performance)</li>
										<li>General geographic location (country level only)</li>
										<li>Referring sources and entry/exit pages</li>
									</ul>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">1.3 Minimal Data Collection Statement</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										GreenVue is committed to privacy and only uses Vercel Analytics for anonymous usage statistics. We do not collect any personal usage data beyond what&apos;s necessary for your account functionality. We do not sell data to third parties or use it for commercial purposes.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="use">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">2</span>
									How We Use Your Information
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We may use the information we collect for various purposes, including:
									</p>
									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li>To provide, maintain, and improve the Platform</li>
										<li>To create and manage your account</li>
										<li>To enable you to communicate with other users</li>
										<li>To personalize your experience</li>
										<li>To respond to your inquiries and provide support</li>
										<li>To send administrative information (service updates, security alerts)</li>
										<li>To prevent fraud and abuse of our Platform</li>
										<li>To comply with legal obligations</li>
									</ul>

									<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md">
										<p className="text-gray-600 dark:text-gray-300">
											<strong>Note:</strong> As a non-commercial service, we do not use your data for advertising, marketing, or revenue-generating activities.
										</p>
									</div>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="cookies">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">3</span>
									Cookies and Similar Technologies
									<FaCookieBite className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We use cookies and similar tracking technologies to collect and track information about your interactions with our Platform.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.1 Types of Cookies We Use</h3>
									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li><strong>Essential cookies:</strong> Required for the basic functioning of the Platform</li>
										<li><strong>Functionality cookies:</strong> Remember your preferences and settings</li>
										<li><strong>Authentication cookies:</strong> Manage user sessions and security</li>
									</ul>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">3.2 Your Cookie Choices</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										Most web browsers are set to accept cookies by default. You can set your browser to refuse all or some browser cookies, or to alert you when cookies are being sent. However, if you disable or refuse cookies, please note that some parts of the Platform may become inaccessible or not function properly.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="sharing">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">4</span>
									How We Share Your Information
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										As a non-commercial service operated by a single individual, we limit the sharing of your personal information. We may share your information in the following circumstances:
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.1 With Other Users</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										When you create listings or communicate with other users, certain information (such as your username, profile picture, listing details, and messages) is visible to those users. Please be mindful of the information you share in listings and messages.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.2 Service Providers</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We may share your information with third-party service providers who help us operate and improve our Platform, such as hosting providers, authentication services, and analytics tools. These providers are contractually obligated to use your information only for the purposes of providing services to us.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">4.3 Legal Requirements</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We may disclose your information if required to do so by law or in response to valid requests by public authorities (e.g., a court or government agency).
									</p>

									<div className="p-4 border-l-4 border-amber-500 bg-amber-50 dark:bg-amber-950/30 dark:border-amber-600 mb-4">
										<p className="text-amber-800 dark:text-amber-300 flex items-start">
											<FaExclamationTriangle className="mr-2 h-5 w-5 flex-shrink-0 mt-0.5" />
											<span>
												<strong>Important:</strong> We do not sell, rent, or trade your personal information to third parties for their marketing purposes.
											</span>
										</p>
									</div>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="data-security">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">5</span>
									Data Security
									<FaDatabase className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We implement appropriate technical and organizational measures to protect the security of your personal information. However, please be aware that no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">5.1 Your Responsibility</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										The security of your account also depends on maintaining the confidentiality of your password. Please do not share your password with anyone, and notify us immediately if you believe your account has been compromised.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">5.2 Data Retention</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We will retain your personal information only for as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. When your data is no longer needed, we will securely delete or anonymize it.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="gdpr">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">6</span>
									Your Data Protection Rights
									<FaGlobe className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										As a service operated within the European Union, we comply with the General Data Protection Regulation (GDPR). Depending on your location, you may have the following rights regarding your personal data:
									</p>

									<ul className="list-disc space-y-2 text-gray-600 dark:text-gray-300 ml-4 mb-4">
										<li><strong>Right to access:</strong> You can request copies of your personal data.</li>
										<li><strong>Right to rectification:</strong> You can request that we correct inaccurate or complete incomplete information.</li>
										<li><strong>Right to erasure:</strong> You can request that we delete your personal data in certain circumstances.</li>
										<li><strong>Right to restrict processing:</strong> You can request that we restrict the processing of your data in certain circumstances.</li>
										<li><strong>Right to data portability:</strong> You can request that we transfer your data to another organization or directly to you.</li>
										<li><strong>Right to object:</strong> You can object to our processing of your personal data in certain circumstances.</li>
									</ul>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">6.1 How to Exercise Your Rights</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										To exercise any of these rights, please contact us using the information provided in the &quot;Contact Us&quot; section. We will respond to your request within 30 days. There is no fee for making a request, but we may charge a reasonable fee if your request is clearly unfounded, repetitive, or excessive.
									</p>

									<h3 className="font-medium text-gray-800 dark:text-gray-200 mt-4 mb-2">6.2 Data Export</h3>
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We provide a data export feature that allows you to download a copy of your personal data in a structured, commonly used, and machine-readable format. You can access this feature in your account settings.
									</p>
								</div>
							</section>							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="contact">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">7</span>
									Contact Us
									<FaShieldAlt className="ml-2 text-green-600 dark:text-green-500" />
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										If you have any questions, concerns, or complaints about this Privacy Policy or our data practices, please contact us:
									</p>

									<div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 p-4 rounded-md">
										<p className="text-gray-700 dark:text-gray-300">
											Email: <a href="mailto:contact@greenvue.eu" className="text-green-600 dark:text-green-500 hover:underline">contact@greenvue.eu</a>
										</p>
										<p className="text-gray-700 dark:text-gray-300 mt-2">
											GreenVue is operated by an individual based in the European Union.
										</p>
									</div>

									<p className="text-gray-600 dark:text-gray-300 mt-4 mb-4">
										We will respond to your request or inquiry within a reasonable timeframe, typically within 30 days.
									</p>
								</div>
							</section>

							<section className="mb-10">
								<h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center" id="changes">
									<span className="mr-2 h-6 w-6 flex items-center justify-center rounded-full bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 text-sm">8</span>
									Changes to This Privacy Policy
								</h2>
								<div className="pl-8 border-l border-gray-200 dark:border-gray-700">
									<p className="text-gray-600 dark:text-gray-300 mb-4">
										We may update our Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the &quot;Last updated&quot; date.
									</p>

									<p className="text-gray-600 dark:text-gray-300 mb-4">
										You are advised to review this Privacy Policy periodically for any changes. Changes to this Privacy Policy are effective when they are posted on this page.
									</p>
								</div>
							</section>
						</div>
					</div>

					<div className="bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-6 rounded-md flex justify-between items-center">
						<p className="text-gray-600 dark:text-gray-300">
							By using GreenVue, you agree to the collection and use of information in accordance with this Privacy Policy.
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

export default PrivacyPage;