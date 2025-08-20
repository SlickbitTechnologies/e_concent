import { Shield, Menu, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover";

const Header = () => {
	const navigate = useNavigate();
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [userEmail, setUserEmail] = useState("");
	const [userName, setUserName] = useState("");

	useEffect(() => {
		const sync = () => {
			const email = localStorage.getItem("userEmail") || "";
			const name = localStorage.getItem("userName") || "";
			const token = localStorage.getItem("token") || "";
			setUserEmail(token ? email : "");
			setUserName(token ? name : "");
		};
		sync();
		window.addEventListener("storage", sync);
		return () => window.removeEventListener("storage", sync);
	}, []);

	const handleLogout = () => {
		localStorage.removeItem("token");
		localStorage.removeItem("userEmail");
		localStorage.removeItem("userName");
		setUserEmail("");
		setUserName("");
		navigate("/auth");
	};

	const display = userName || userEmail || "";
	const initials = (s) => {
		const base = (userName || userEmail || "").trim();
		if (!base) return "";
		const source = userName || (userEmail.split("@")[0] || "");
		const parts = source.replace(/[^a-z0-9]+/gi, " ").trim().split(" ");
		return parts.filter(Boolean).slice(0, 2).map(p => p[0]?.toUpperCase()).join("") || "U";
	};

	return (
		<header className="bg-background border-b border-border sticky top-0 z-50">
			<div className="container mx-auto px-4">
				<div className="flex items-center justify-between h-16">
					<div className="flex items-center space-x-3">
						<div className="flex items-center justify-center w-10 h-10 bg-primary rounded-lg">
							<Shield className="w-6 h-6 text-primary-foreground" />
						</div>
						<div>
							<h1 className="text-xl font-bold text-foreground">MedConsent</h1>
							<p className="text-xs text-muted-foreground">Clinical Trial Platform</p>
						</div>
					</div>

					<nav className="hidden md:flex items-center space-x-8" />

					<div className="flex items-center space-x-4">
						{display ? (
							<>
								<Button variant="outline" size="sm" className="hidden md:inline-flex" onClick={() => navigate("/home")}>Dashboard</Button>
								<Popover>
									<PopoverTrigger asChild>
										<Button variant="ghost" size="sm" className="flex items-center gap-2">
											<div className="w-8 h-8 rounded-full bg-primary/10 text-primary grid place-items-center font-semibold">
												{initials(display)}
											</div>
											<span className="hidden sm:block text-sm text-foreground/90 max-w-[160px] truncate">{display}</span>
										</Button>
									</PopoverTrigger>
									<PopoverContent align="end" className="w-56">
										<div className="pb-2 mb-2 border-b text-sm">
											<div className="font-medium text-foreground">Signed in</div>
											<div className="text-muted-foreground truncate">{display}</div>
										</div>
										<div className="grid gap-2">
											<Button variant="ghost" className="justify-start" onClick={() => navigate('/home')}>Dashboard</Button>
											<Button variant="ghost" className="justify-start" onClick={() => navigate('/consent-form')}>Consent Form</Button>
											<Button variant="destructive" className="justify-start" onClick={handleLogout}>Sign Out</Button>
										</div>
									</PopoverContent>
								</Popover>
								<Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
									<Menu className="w-5 h-5" />
								</Button>
							</>
						) : (
							<>
								<Button variant="ghost" size="sm" className="hidden md:flex" onClick={() => navigate('/auth')}>
									<User className="w-4 h-4 mr-2" />
									Sign In
								</Button>
								<Button variant="medical" size="sm" onClick={() => navigate('/auth')}>
									Get Started
								</Button>
								<Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsMenuOpen(!isMenuOpen)}>
									<Menu className="w-5 h-5" />
								</Button>
							</>
						)}
					</div>
				</div>

				{isMenuOpen && (
					<div className="md:hidden py-4 border-t border-border">
						<nav className="flex flex-col space-y-3">
							{display ? (
								<>
									<Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMenuOpen(false); navigate('/home'); }}>Dashboard</Button>
									<Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMenuOpen(false); navigate('/consent-form'); }}>Consent Form</Button>
									<Button variant="destructive" size="sm" className="justify-start" onClick={() => { setIsMenuOpen(false); handleLogout(); }}>Sign Out</Button>
								</>
							) : (
								<>
									<Button variant="ghost" size="sm" className="justify-start" onClick={() => { setIsMenuOpen(false); navigate('/auth'); }}>
										<User className="w-4 h-4 mr-2" />
										Sign In
									</Button>
								</>
							)}
						</nav>
					</div>
				)}
			</div>
		</header>
	);
};

export default Header;


