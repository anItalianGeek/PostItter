export class DarkModeSetter {

  public static setDarkMode(): void {
    document.querySelectorAll('*').forEach((e) => {
      if ((e as HTMLElement).tagName.toLowerCase() != "app-post") {
        (e as HTMLElement).style.backgroundColor = '#3a3a3a';
        (e as HTMLElement).style.color = 'white';
      }
    });
  }

}
