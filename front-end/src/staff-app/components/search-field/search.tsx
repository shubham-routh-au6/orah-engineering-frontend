import * as React from "react"
import styled from "styled-components"

export const Search = ({ handleSubmit, input, setInput }: props) => {
  return (
    <S.StyledForm onSubmit={handleSubmit}>
      <S.StyledInput value={input} onChange={(e) => setInput(e.target.value)} type="text" placeholder="Search" />
      <S.StyledButton type="submit">Go</S.StyledButton>
    </S.StyledForm>
  )
}

type props = {
  input: string
  setInput: React.Dispatch<React.SetStateAction<string>>
  handleSubmit: (e: React.FormEvent) => void
}

const S = {
  StyledInput: styled.input`
    width: 90%;
    height: 2rem;
    border-radius: 2rem;
    box-shadow: inset 0 0 3px black;
    padding: 0 1rem;
    border: 1px solid grey;

    &:focus {
      box-shadow: 0 0 10px 1000px rgba(0, 0, 0, 0.5);
      outline: none;
    }

    @media only screen and (max-width: 1020px) {
      width: 85%;
    }

    @media only screen and (max-width: 768px) {
      width: 70%;
    }

    @media only screen and (max-width: 638px) {
      width: 60%;
    }
  `,

  StyledButton: styled.button`
    position: absolute;
    right: 1rem;
    top: 0.4rem;
    padding: 0.3rem;
    border-radius: 50%;
    border: none;
    color: white;
    background-color: #2f74c0;
    cursor: pointer;
    box-shadow: 0 0 5px black;
    font-size: 0.7rem;

    &:hover {
      background-color: #388ae2;
    }
  `,

  StyledForm: styled.form`
    width: 50%;
    position: relative;
  `,
}
