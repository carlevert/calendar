
export class GoogleCalendarWrapper {

   private API_KEY = "AIzaSyCcHj8zg9-Q4vQLOOEoK98H022Be5CAPP4";
   private CLIENT_ID = '180698325131-n12gqnvlcf0e4ukvcd7t9ihu8922fj3s.apps.googleusercontent.com';
   private SCOPES = ["https://www.googleapis.com/auth/calendar.readonly"];

   private authParams = {
      client_id: this.CLIENT_ID,
      scope: this.SCOPES.join(' '),
      immediate: true,
      response_type: "token"
   };

   public user: gapi.auth2.GoogleUser;

   public start() {

      gapi.load("client:auth2", () => {

         gapi.auth2.init({
            client_id: this.CLIENT_ID,
            scope: "profile",
            fetch_basic_profile: true,
         });

         gapi.auth2.getAuthInstance().isSignedIn.listen(this.handleSignInChange.bind(this));
         gapi.client.load("calendar", "v3");

      });
   }

   public async fetchCalendars() {
      await gapi.client.load("calendar", "v3");

      let calendars = gapi.client.calendar.calendarList.list();
      return new Promise<gapi.client.calendar.CalendarListEntry[]>(resolve => {
         calendars.execute(resp => {
            resolve(resp.items);
         })
      })

   }

   public async fetchEntries(calendarId: string, startDate: string, endDate: string) {
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

   public signIn() {
      console.log("Signing in...");
      gapi.auth2.getAuthInstance().signIn();
   }

   public signOut() {
      console.log("Signing out...");
      gapi.auth2.getAuthInstance().signOut();
   }

   public handleSignInChange(signedIn: boolean) {

      if (signedIn) {
         console.log("Signed in");
         this.user = gapi.auth2.getAuthInstance().currentUser.get();

      }
      if (this.signInCallback)
         this.signInCallback(signedIn);

   }

   constructor(public signInCallback?: (signedIn: boolean) => void) {
   }



}
