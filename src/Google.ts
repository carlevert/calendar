
export class GoogleCalendarWrapper {

	private API_KEY = "AIzaSyCeuBXU9QuVz8x6vBPtxzeZwsckUMmXNG4";
	private CLIENT_ID = '96286177558-efa875l2q35dlecescffu23h8pfl0qd1.apps.googleusercontent.com';
	private SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

	private authParams = {
		client_id: this.CLIENT_ID,
		scope: this.SCOPES.join(' '),
		immediate: true,
		response_type: "token"
	};

	user: gapi.auth2.GoogleUser;

	start() {

		gapi.load("client:auth2", () => {

			gapi.auth2.init({
				client_id: this.CLIENT_ID,
				scope: "profile https://www.googleapis.com/auth/calendar.readonly",
				fetch_basic_profile: true,
			});

			gapi.auth2.getAuthInstance().isSignedIn.listen(this.handleSignInChange.bind(this));
			gapi.client.load("calendar", "v3");

		});
	}

	async fetchCalendars() {
		await gapi.client.load("calendar", "v3");
		const calendars = gapi.client.calendar.calendarList.list();

		return new Promise<gapi.client.calendar.CalendarListEntry[]>(resolve => {
			calendars.execute(resp => {
				resolve(resp.items);
			});
		});

	}

	async fetchEntries(calendarId: string, startDate: string, endDate: string) {
		await gapi.client.load("calendar", "v3");

		let entries = gapi.client.calendar.events.list({
			calendarId,
			maxResults: 500,
			timeMin: startDate,
			timeMax: endDate
		});

		return new Promise<gapi.client.calendar.Event[]>(resolve => {
			entries.execute(resp => {
				resolve(resp.items);
			})
		})

	}

	signIn() {
		gapi.auth2.getAuthInstance().signIn();
	}

	signOut() {
		gapi.auth2.getAuthInstance().signOut();
	}

	handleSignInChange(signedIn: boolean) {

		if (signedIn) {
			this.user = gapi.auth2.getAuthInstance().currentUser.get();
			if (this.signInCallback)
				this.signInCallback(signedIn);

		}
		else {
			this.user = undefined;
		}

	}

	constructor(private signInCallback?: (signedIn: boolean) => void) {
	}



}
