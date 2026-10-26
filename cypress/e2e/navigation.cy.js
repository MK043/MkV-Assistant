describe('MkV Sales Manager Navigation Flow', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3000/');
  });

  it('redirects root to /hub', () => {
    cy.url().should('include', '/hub');
    cy.contains('MkV Sales Manager').should('be.visible');
  });

  it('navigates to Analytics page', () => {
    cy.contains('Аналітика').click();
    cy.url().should('include', '/analytics');
    cy.contains('Панель крос-платформної аналітики').should('be.visible');
  });

  it('navigates to Creative Studio page', () => {
    cy.contains('ШІ-Студія').click();
    cy.url().should('include', '/creative');
    cy.contains('ШІ-Генератор рекламних розкадровок').should('be.visible');
  });

  it('navigates to Campaigns page', () => {
    cy.contains('Кампанії').click();
    cy.url().should('include', '/campaigns');
    cy.contains('Управління рекламними зв’язками').should('be.visible');
  });

  it('navigates to Fatigue Detector page', () => {
    cy.contains('Вигорання хуків').click();
    cy.url().should('include', '/fatigue');
    cy.contains('Детектор вигорання аудиторії та хуки').should('be.visible');
  });

  it('displays 404 page for unknown routes', () => {
    cy.visit('http://localhost:3000/unknown-route', { failOnStatusCode: false });
    cy.contains('404').should('be.visible');
    cy.contains('Сторінку не знайдено').should('be.visible');
  });
});
