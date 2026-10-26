import React from 'react';
import MetricCard from '../../src/components/MetricCard/MetricCard';

describe('<MetricCard /> Component Test', () => {
  it('renders metric title, value and trend accurately', () => {
    cy.mount(
      <MetricCard
        title="Середня окупність (ROAS)"
        value="3.82x"
        change="+12.4%"
        isPositive={true}
      />
    );
    cy.contains('Середня окупність (ROAS)').should('be.visible');
    cy.contains('3.82x').should('be.visible');
    cy.contains('+12.4%').should('be.visible');
  });
});
