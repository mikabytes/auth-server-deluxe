import { css } from "https://cdn.jsdelivr.net/npm/lit@3.1.2/+esm"

export default css`
  :host {
    display: block;
    width: 100%;
    max-width: 640px;
    margin: 0 auto;
    background-color: #fff;
    border-radius: 0.5rem;
    padding: 1rem;
  }

  select {
    padding: 0.5rem;
    border: 2px solid var(--green);
    border-radius: 4px;
    background-color: var(--matted);
    color: #efefef;
    margin-bottom: 1rem;
    padding: 0.5rem 1rem;
  }

  .oneline {
    display: flex;
    justify-content: space-between;
    align-items: center;
  }

  #user-resources {
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    grid-gap: 1rem;
  }

  .resource-item {
    text-align: center;
    padding: 20px 10px;
    border: 2px solid #ccc;
    background-color: #ccc;
    font-weight: bold;
    color: #333;
    cursor: pointer;
    user-select: none;
  }

  .resource-item.checked {
    border-color: var(--green);
    background-color: var(--gray);
  }
`
