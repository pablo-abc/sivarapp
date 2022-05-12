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
    clip: rect(0 0 0 0);
    height: auto;
    margin: 0;
    overflow: hidden;
    padding: 0;
    position: absolute;
    width: 1px;
    white-space: nowrap;
  }

  a > .ellipsis::after {
    content: '\u2026';
  }
`;
