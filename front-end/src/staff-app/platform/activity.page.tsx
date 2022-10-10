import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/"
import { faPlay } from "@fortawesome/free-solid-svg-icons"
import { DetailsPage } from "./details.page"

export const ActivityPage: React.FC = () => {
  const [getActivities, fetchedActivities, loader] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  const [data, setData] = useState<Activity[]>([])
  const [showDetails, setShowDetails] = useState<boolean>(false)
  const [index, setIndex] = useState<number>()

  if (fetchedActivities && !data.length) {
    console.log("this is hola", fetchedActivities)
    setData(fetchedActivities.activity)
  }

  const formatDate = (param: Date) => {
    return param.toString().slice(0, param.toString().indexOf("T"))
  }

  const handleDetails = (i: number) => {
    console.log("clicked", index)
    setShowDetails(!showDetails)

    if (i === index) {
      setIndex(undefined)
    } else {
      setIndex(i)
    }
  }

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <>
      <S.Container>
        <S.HeaderContainer>Activities</S.HeaderContainer>
        <S.CardContainer>
          {data.map((d, i) => {
            return (
              <S.Card key={i}>
                {index !== i && (
                  <>
                    {" "}
                    <S.CardItem>
                      <S.CardItemSpan>Type: &nbsp;</S.CardItemSpan>
                      {d.type}
                    </S.CardItem>
                    <S.CardItem>
                      <S.CardItemSpan>Date: &nbsp;</S.CardItemSpan>
                      {formatDate(d.date)}
                    </S.CardItem>{" "}
                  </>
                )}
                <S.CardItem>
                  <S.CardItemSpan>Details: &nbsp;</S.CardItemSpan>
                  <S.CardIconContainer>
                    <FontAwesomeIcon onClick={() => handleDetails(i)} icon={faPlay} />
                  </S.CardIconContainer>
                  {showDetails && index === i && (
                    <>
                      <S.EntityContainer>
                        <S.CardItemSpan>Name: &nbsp;</S.CardItemSpan> {d.entity.name}
                      </S.EntityContainer>
                      <S.EntityContainer>
                        <S.CardItemSpan>Completed at: &nbsp;</S.CardItemSpan> {formatDate(d.entity.completed_at)}
                      </S.EntityContainer>
                    </>
                  )}
                </S.CardItem>
                {showDetails &&
                  index === i &&
                  d.entity &&
                  d.entity.student_roll_states.map((en, i) => {
                    return (
                      <S.CardDetailsContainer>
                        <S.CardItem>
                          <S.CardItemSpan>Student id: &nbsp;</S.CardItemSpan>
                          {en.student_id}
                        </S.CardItem>
                        <S.CardItem>
                          <S.CardItemSpan>Roll state: &nbsp;</S.CardItemSpan>
                          {en.roll_state}
                        </S.CardItem>
                      </S.CardDetailsContainer>
                    )
                  })}
              </S.Card>
            )
          })}
        </S.CardContainer>
      </S.Container>
    </>
  )
}

const S = {
  Container: styled.div`
    display: flex;
    flex-direction: column;
    width: 50%;
    margin: ${Spacing.u4} auto 140px;
  `,
  HeaderContainer: styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    color: #fff;
    background-color: ${Colors.blue.base};
    padding: 14px 14px;
    font-weight: ${FontWeight.strong};
    border-radius: ${BorderRadius.default};
  `,
  CardContainer: styled.div`
    display: flex;
    justify-content: space-around;
    flex-direction: column;
    flex-wrap: wrap;
    margin: 1rem 0;
  `,
  Card: styled.div`
    border: 1px solid black;
    border-radius: ${BorderRadius.default};
    justify-content: space-between;
    margin: 1rem 0;
    display: flex;
    flex-direction: column;
    background-color: #33b4df;
  `,
  CardItem: styled.div`
    padding: 0 1rem;
    margin: 0.4rem 0;
    font-size: 1rem;
    display: flex;
    flex-direction: row;
  `,
  CardItemSpan: styled.span`
    font-weight: bold;
  `,
  CardIconContainer: styled.div`
    cursor: pointer;
  `,
  CardDetailsContainer: styled.div`
    display: flex;
    justify-content: space-between;
    flex-wrap: wrap;
    border: 1px solid black;
    border-radius: ${BorderRadius.default};
    margin: 0.3rem 1rem;
  `,
  EntityContainer: styled.div`
    margin: 0 4rem;
  `,
}
