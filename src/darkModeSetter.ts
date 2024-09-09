export class DarkModeSetter {

  public static setDarkMode(): void {
    document.querySelectorAll('*:not(.post):not(.filters)').forEach((e) => {
      const element = e as HTMLElement;
      element.style.backgroundColor = element.classList.contains('selected') ? element.style.backgroundColor : '#3a3a3a';
      element.style.color = 'white';
    });
    document.querySelectorAll('app-post *').forEach((e) => {
      const element = e as HTMLElement;
      element.style.color = 'black';
    })
  }

}
