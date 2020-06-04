import React, { useState, useEffect } from 'react';

import Header from '../../components/Header';

import api from '../../services/api';

import Food from '../../components/Food';
import ModalAddFood from '../../components/ModalAddFood';
import ModalEditFood from '../../components/ModalEditFood';

import { FoodsContainer } from './styles';

interface IFoodPlate {
  id: number;
  name: string;
  image: string;
  price: string;
  description: string;
  available: boolean;
}

const Dashboard: React.FC = () => {
  const [foods, setFoods] = useState<IFoodPlate[]>([]);
  const [editingFood, setEditingFood] = useState<IFoodPlate>({} as IFoodPlate);
  const [modalOpen, setModalOpen] = useState(false);
  const [editModalOpen, setEditModalOpen] = useState(false);

  useEffect(() => {
    async function loadFoods(): Promise<void> {
      // TODO LOAD FOODS
      const response = await api.get('/foods');
      setFoods(response.data);
    }

    loadFoods();
  }, []);

  async function handleAvalability(
    id: number,
    available: boolean,
  ): Promise<void> {
    const response = await api.put(`/foods/${id}`, { available });

    const foodUpdated = response.data;

    const foodsAllUpdated = foods.map(
      (item): IFoodPlate => {
        return item.id === foodUpdated.id ? foodUpdated : item;
      },
    );

    setFoods(foodsAllUpdated);
  }

  async function handleAddFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    try {
      // [x] TODO ADD A NEW FOOD PLATE TO THE API
      Object.assign(food, { available: false });

      const response = await api.post('/foods', food);
      if (response) {
        setFoods([...foods, response.data]);
      }
    } catch (err) {
      console.log(err);
    }
  }

  async function handleUpdateFood(
    food: Omit<IFoodPlate, 'id' | 'available'>,
  ): Promise<void> {
    // [x] TODO UPDATE A FOOD PLATE ON THE API

    try {
      const updatedFood = await api.put(`/foods/${editingFood.id}`, food);

      const updatedAllFoods = foods.map(
        (item): IFoodPlate =>
          item.id === editingFood.id ? updatedFood.data : item,
      );

      setFoods(updatedAllFoods);
    } catch (err) {
      console.log(err);
    }
  }

  async function handleDeleteFood(id: number): Promise<void> {
    // [x] TODO DELETE A FOOD PLATE FROM THE API
    await api.delete(`/foods/${id}`);

    const updatedAllFoods = foods.filter(item => item.id !== id);

    setFoods(updatedAllFoods);
  }

  function toggleModal(): void {
    setModalOpen(!modalOpen);
  }

  function toggleEditModal(): void {
    setEditModalOpen(!editModalOpen);
  }

  function handleEditFood(food: IFoodPlate): void {
    // [x] TODO SET THE CURRENT EDITING FOOD ID IN THE STATE
    setEditingFood(food);
    toggleEditModal();
  }

  return (
    <>
      <Header openModal={toggleModal} />
      <ModalAddFood
        isOpen={modalOpen}
        setIsOpen={toggleModal}
        handleAddFood={handleAddFood}
      />
      <ModalEditFood
        isOpen={editModalOpen}
        setIsOpen={toggleEditModal}
        editingFood={editingFood}
        handleUpdateFood={handleUpdateFood}
      />

      <FoodsContainer data-testid="foods-list">
        {foods &&
          foods.map(food => (
            <Food
              key={food.id}
              food={food}
              handleDelete={handleDeleteFood}
              handleEditFood={handleEditFood}
              handleAvalability={handleAvalability}
            />
          ))}
      </FoodsContainer>
    </>
  );
};

export default Dashboard;
