import React from 'react';
import { StyleSheet, Text, View, TouchableOpacity, FlatList, ScrollView, Modal, ActivityIndicator } from 'react-native';
import Colors from './Colors';
import { AntDesign } from '@expo/vector-icons';
import TodoList from './components/TodoList';
import AddListModel from './components/AddListModel';
import Fire from './Fire';
import firebase from 'firebase/compat/app';

export default class App extends React.Component {
  state = {
    addTodoVisible: false,
    lists: [],
    user: {},
    loading: true,
  };

  componentDidMount() {
    this.firebase = new Fire((error, user) => {
      if (error) {
        return alert("Something went wrong, please try to fix it.");
      }

      this.firebase.getLists((lists) => {
        this.setState({ lists, user, loading: false });
      });

      this.setState({ user });
    });
  }

  componentWillUnmount() {
    this.firebase.detach(); 
  }

  toggleAddTodoModal = () => {
    this.setState({ addTodoVisible: !this.state.addTodoVisible });
  };

  renderList = (list) => {
    return <TodoList list={list} updateList={this.updateList} />;
  };

  addList = (list) => {
    const listExists = this.state.lists.some(existingList => existingList.name === list.name);
    if (!listExists) {
      this.firebase.addList({
        name: list.name,
        color: list.color,
        todos: [],
      });
    } else {
      alert("List already exists.");
    }
  };

  updateList = (list) => {
    this.firebase.updateList(list)
  };

  render() {
    if (this.state.loading) {
      return (
        <View style={styles.container}>
          <ActivityIndicator size="large" color={Colors.blue} />
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <Modal
          animationType="slide"
          visible={this.state.addTodoVisible}
          onRequestClose={this.toggleAddTodoModal}
        >
          <AddListModel closeModal={this.toggleAddTodoModal} addList={this.addList} />
        </Modal>

        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.titleContainer}>
            <View style={styles.divider} />
            <Text style={styles.title}>
              TODO <Text style={{ fontWeight: '300', color: Colors.blue }}>Lists</Text>
            </Text>
            <View style={styles.divider} />
          </View>

          <View style={styles.addListContainer}>
            <TouchableOpacity style={styles.addList} onPress={this.toggleAddTodoModal}>
              <AntDesign name="plus" size={16} color={Colors.blue} />
            </TouchableOpacity>
            <Text style={styles.add}>Add List</Text>
          </View>

          <View style={styles.flatListContainer}>
            <FlatList
              data={this.state.lists}
              keyExtractor={(item) => item.id.toString()}
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => this.renderList(item)}
              keyboardShouldPersistTaps="always"
            />
          </View>
        </ScrollView>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingTop: 40,
    paddingHorizontal: 16,
    marginTop:70
  },
  scrollContainer: {
    flexGrow: 1,
    alignItems: 'center',
    paddingBottom: 20,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  divider: {
    backgroundColor: Colors.lightBlue,
    height: 1,
    flex: 1,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: Colors.black,
    paddingHorizontal: 16,
  },
  addListContainer: {
    marginVertical: 24,
    alignItems: 'center',
  },
  addList: {
    borderWidth: 2,
    borderColor: Colors.lightBlue,
    borderRadius: 4,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  add: {
    color: Colors.blue,
    fontWeight: '600',
    fontSize: 14,
    marginTop: 8,
  },
  flatListContainer: {
    marginTop: 16,
    width: '100%',
    paddingLeft: 32,
  },
});
