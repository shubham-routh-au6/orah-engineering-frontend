import React, { useEffect, useState } from "react"
import { RolllStateType } from "shared/models/roll"
import { RollStateIcon } from "staff-app/components/roll-state/roll-state-icon.component"
import { Person } from "shared/models/person"

interface Props {
  initialState?: RolllStateType
  size?: number
  onStateChange?: (newState: RolllStateType) => void
  id: number
  studentData: Person[]
  setStudentData: React.Dispatch<React.SetStateAction<Person[]>>
}
export const RollStateSwitcher: React.FC<Props> = ({ initialState = "unmark", size = 40, onStateChange, id, studentData, setStudentData }) => {
  const [rollState, setRollState] = useState(initialState)

  useEffect(() => {
    updateStRoll()
  }, [])

  const nextState = () => {
    const states: RolllStateType[] = ["present", "late", "absent"]
    if (rollState === "unmark" || rollState === "absent") return states[0]
    const matchingIndex = states.findIndex((s) => s === rollState)
    return matchingIndex > -1 ? states[matchingIndex + 1] : states[0]
  }

  const onClick = () => {
    const next = nextState()
    setRollState(next)
    updateStAttendance(next)
    if (onStateChange) {
      onStateChange(next)
    }
  }

  const updateStAttendance = (status: "unmark" | "present" | "absent" | "late") => {
    const myStudentList = [...studentData]
    const student = myStudentList.find((a) => a.id === id)
    if (student) {
      student.attendance = status
    }
    setStudentData(myStudentList)
  }

  const updateStRoll = () => {
    const myStudentList = [...studentData]
    const student = myStudentList.find((a) => a.id === id)
    if (student && student.attendance && student.attendance !== "unmark") {
      setRollState(student.attendance)
    }
  }

  return <RollStateIcon type={rollState} size={size} onClick={onClick} />
}
