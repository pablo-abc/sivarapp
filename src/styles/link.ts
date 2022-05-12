import { css } from 'lit';

export default css`
  a {
    color: var(--sl-color-primary-800, blue);
    text-decoration: none;
  }

  a:visited {
    color: var(--sl-color-primary-800, blue);
  }

  a .invisible {
    display: none;
  }

  a > .invisible ~ span::after {
    content: '\u2026';
  }
`;
