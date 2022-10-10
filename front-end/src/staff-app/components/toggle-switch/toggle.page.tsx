import * as React from 'react';
import styled from "styled-components"
import { ChangeEvent } from "react"
import COLORS from "./color"

type props = {
  handleOnChange: (e: ChangeEvent<HTMLInputElement>) => void
  toggleState: boolean
}

export const ToggleSwitch = ({ handleOnChange, toggleState }: props) => {
  return (
    <T.StyledLabel htmlFor="checkbox" checked={toggleState}>
      <input id="checkbox" type="checkbox" checked={toggleState} onChange={handleOnChange} />
    </T.StyledLabel>
  )
}

const T = {
  StyledLabel: styled.label<{ checked: boolean }>`
    cursor: pointer;
    text-indent: -9999px;
    width: 30px;
    height: 15px;
    background: ${({ checked }) => (checked ? COLORS.GRAY : COLORS.GREEN)};
    display: block;
    border-radius: 50px;
    position: relative;

    &:after {
      content: "";
      position: absolute;
      left: ${({ checked }) => (checked ? "4px" : "calc(90% - 11px)")};
      top: 2.5px;
      width: 10px;
      height: 10px;
      background: #fff;
      border-radius: 70px;
      transition: 0.3s;
    }
  `,
}
