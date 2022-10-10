import React, { useEffect, useState } from "react"
import styled from "styled-components"
import { Spacing, BorderRadius, FontWeight } from "shared/styles/styles"
import { useApi } from "shared/hooks/use-api"
import { Colors } from "shared/styles/colors"
import { Activity } from "shared/models/activity"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome/"
import { faPlay } from "@fortawesome/free-solid-svg-icons"

export const DetailsPage: React.FC = () => {
  const [getActivities, fetchedActivities, loader] = useApi<{ activity: Activity[] }>({ url: "get-activities" })

  const [data, setData] = useState<Activity[]>([])

  if (fetchedActivities && !data.length) {
    console.log("this is hola", fetchedActivities)
    setData(fetchedActivities.activity)
  }

  const formatDate = (param: Date) => {
    return param.toString().slice(0, param.toString().indexOf("T"))
  }

  const handleDetails = () => {
    console.log('clicked')
  }

  useEffect(() => {
    void getActivities()
  }, [getActivities])

  return (
    <S.Container>
      <S.HeaderContainer>Details</S.HeaderContainer>
      <S.CardContainer>
        {data.map((d, i) => {
          return (
            <S.Card key={i}>
              <S.CardItem>
                <S.CardItemSpan>Type: &nbsp;</S.CardItemSpan>
                {d.type}
              </S.CardItem>
              <S.CardItem>
                <S.CardItemSpan>Date: &nbsp;</S.CardItemSpan>
                {formatDate(d.date)}
              </S.CardItem>
              <S.CardItem>
                <S.CardItemSpan>Details: &nbsp;</S.CardItemSpan>
                <S.CardIconContainer>
                  <FontAwesomeIcon onClick={handleDetails} icon={faPlay} />
                </S.CardIconContainer>
              </S.CardItem>
            </S.Card>
          )
        })}
      </S.CardContainer>
    </S.Container>
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
    flex-wrap: wrap;
    margin: 1rem 0;
  `,
  Card: styled.div`
    border: 1px solid black;
    border-radius: ${BorderRadius.default};
    width: 200px;
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
}
