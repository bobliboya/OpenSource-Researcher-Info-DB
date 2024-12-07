import networkx as nx
import matplotlib
matplotlib.use('agg')  # Use the 'agg' backend for non-GUI rendering
import matplotlib.pyplot as plt

def draw_relationship_graph(topic_work_dict, work_author_dict, work_info_set, people_info_set, university_info_set, topic_info_set, output_file='relationship_graph.png'):
    # Create a directed graph
    G = nx.DiGraph()

    # Define colors for different node types
    node_colors = []

    # Add university nodes
    for university_info_frozenset in university_info_set:
        university_info = dict(university_info_frozenset)
        university_node = university_info['Institution_Name']
        G.add_node(university_node, label='University')
        node_colors.append('blue')  # Color for university nodes

    # Add people nodes
    for people_info_frozenset in people_info_set:
        people_info = dict(people_info_frozenset)
        people_node = people_info['author_name']
        G.add_node(people_node, label='Person')
        node_colors.append('green')
    
    # Add topic nodes
    for topic_info_frozenset in topic_info_set:
        topic_info = dict(topic_info_frozenset)
        topic_node = topic_info['topic_name']
        G.add_node(topic_node, label='Topic')
        node_colors.append('red')

    # Add work nodes
    for work_info_frozenset in work_info_set:
        work_info = dict(work_info_frozenset)
        work_node = work_info['title']
        G.add_node(work_node, label='Work')
        node_colors.append('yellow')

    # Add university and people edges
    for university_info_frozenset in university_info_set:
        university_info = dict(university_info_frozenset)
        university_node = university_info['Institution_Name']
        for people_info_frozenset in people_info_set:
            people_info = dict(people_info_frozenset)
            people_node = people_info['author_name']
            if people_info['university_name'] == university_info['Institution_Name']:
                G.add_edge(people_node, university_node, label='Attended')

    # Add work and topic edges
    for topic_info_frozenset in topic_info_set:
        topic_info = dict(topic_info_frozenset)
        topic_node = topic_info['topic_name']
        for work_info_frozenset in work_info_set:
            work_info = dict(work_info_frozenset)
            work_node = work_info['title']
            # print("---------------------------------------------")
            # print(work_info['work_id'])
            print(topic_info['topic_id'])
            # print(topic_work_dict)
            
            print("I'm in add work and topic edges")
            if topic_info['topic_id'] not in topic_work_dict:
                print("I'm out of add work and topic edges")
                continue
            if work_info['work_id'] in topic_work_dict[topic_info['topic_id']]:
                G.add_edge(work_node, topic_node, label='Belongs to')
            # print("I'm out of add work and topic edges")

    # Add work and people edges
    for work_info_frozenset in work_info_set:
        work_info = dict(work_info_frozenset)
        work_node = work_info['title']
        for people_info_frozenset in people_info_set:
            people_info = dict(people_info_frozenset)
            people_node = people_info['author_name']
            # print("---------------------------------------------")
            # print(work_info['work_id'])
            # print(people_info['author_id'])
            # print(work_author_dict[work_info['work_id']])
            print("I'm in add work and people edges")
            if work_info['work_id'] not in work_author_dict:
                continue
            if people_info['author_id'] in work_author_dict[work_info['work_id']]:
                G.add_edge(people_node, work_node, label='Wrote')
            print("I'm out of add work and people edges")

    # Draw the graph
    plt.figure(figsize=(8, 8))  # Increase the figure size
    node_diameter = 3000  # Diameter of the node
    k = 1.5 * (node_diameter / 3000)  # Adjust the optimal distance between nodes
    pos = nx.spring_layout(G, center=(0.5, 0.5), k=k, iterations=100)  # Adjust the layout parameters
    labels = nx.get_edge_attributes(G, 'label')
    nx.draw(G, pos, with_labels=True, node_size=node_diameter, node_color=node_colors, font_size=10, font_weight='bold')

    # Draw edge labels with custom text color
    nx.draw_networkx_edge_labels(G, pos, edge_labels=labels, font_color='black')  # Change 'black' to your desired color

    # Save the plot to a file
    plt.savefig(output_file)
    plt.close()

