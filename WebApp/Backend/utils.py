import networkx as nx
import matplotlib
matplotlib.use('agg')  # Use the 'agg' backend for non-GUI rendering
import matplotlib.pyplot as plt


def draw_relationship_graph(people_info_set, university_info, topic_info_set, output_file='relationship_graph.png'):
    # Create a directed graph
    G = nx.DiGraph()

    # Add university node
    university_node = university_info['Institution_Name']
    G.add_node(university_node, label='University')

    # Add people nodes and edges
    for people_info_frozenset in people_info_set:
        people_info = dict(people_info_frozenset)
        people_node = people_info['author_name']
        G.add_node(people_node, label='Person')
        G.add_edge(people_node, university_node, label='Attended')

    # Add topic nodes and edges
    for topic_info in topic_info_set:
        topic_node = topic_info['topic_name']
        G.add_node(topic_node, label='Topic')
        G.add_edge(university_node, topic_node, label='Researches')

    # Draw the graph
    pos = nx.spring_layout(G)
    labels = nx.get_edge_attributes(G, 'label')
    nx.draw(G, pos, with_labels=True, node_size=3000, node_color='lightblue', font_size=10, font_weight='bold')
    nx.draw_networkx_edge_labels(G, pos, edge_labels=labels)

    # Save the plot to a file
    plt.savefig(output_file)
    plt.close()

def find_relationship(people_info_frozenset, university_info):
    # Convert frozenset back to dictionary
    people_info = dict(people_info_frozenset)
    
    # Access the university_name value
    return people_info.get("university_name") == university_info.get("Institution_Name")